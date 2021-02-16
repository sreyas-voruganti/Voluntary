const http = require("http").createServer();
const socket_auth = require("./middleware/socket.middleware");
const Notification = require("./models/Notification.model");
const asyncRedis = require("async-redis");
const client = asyncRedis.createClient();

client.on("error", (err) => {
  console.log("Redis Error " + err);
});

client
  .flushall()
  .then(() => console.log("Redis flushed"))
  .catch((err) => console.log(err));

const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

// Define Namespaces
const notifNamespace = io.of("/notifications");

// Use Middleware
notifNamespace.use(socket_auth);

// Listen to Events
notifNamespace.on("connection", async (socket) => {
  try {
    socket.join(`notif_${socket.user._id}`);
    await client.sadd("active_users", socket.user._id.toString());
    socket.on("mark_all", async () => {
      try {
        await Notification.deleteMany({ user: socket.user._id });
      } catch (e) {
        console.log(e);
      }
    });
    socket.on("mark_one", async (notifId) => {
      try {
        await Notification.findByIdAndDelete(notifId);
      } catch (e) {
        console.log(e);
      }
    });
    socket.on("disconnect", async () => {
      try {
        await client.srem("active_users", socket.user._id.toString());
      } catch (e) {
        console.log(e);
      }
    });
  } catch (e) {
    console.log(e);
  }
});

// Utils
function sendNotif(userIds, type, content) {
  userIds.forEach(async (userId) => {
    try {
      const notification = await Notification.create({
        user: userId,
        content,
        type,
      });
      notifNamespace.to(`notif_${userId}`).emit("new_notif", notification);
    } catch (e) {
      console.log(e);
    }
  });
}

module.exports = {
  sendNotif,
  socket: http,
};
