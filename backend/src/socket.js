const http = require("http").createServer();
const socket_auth = require("./middleware/socket.middleware");
const socket_chat = require("./middleware/socket_chat");
const Message = require("./models/Message.model");
const User = require("./models/User.model");
const Notification = require("./models/Notification.model");
const asyncRedis = require("async-redis");
const client = asyncRedis.createClient();
const config = require("../config");

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
const chatNamespace = io.of("/chat");
const notifNamespace = io.of("/notifications");

// Use Middleware
chatNamespace.use(socket_auth);
chatNamespace.use(socket_chat);
notifNamespace.use(socket_auth);

// Listen to Events
chatNamespace.on("connection", async (socket) => {
  try {
    await client.sadd(socket.chat._id.toString(), socket.user._id.toString());
    socket.join(`chat_${socket.chat._id}`);
    socket.on("send_message", async (msg) => {
      const users = [
        socket.chat.user.toString(), // from
        socket.chat.service.user.toString(), // to
      ];
      const current_user = users.indexOf(socket.user._id.toString());
      try {
        const message = await Message.create({
          user: socket.user._id,
          chat: socket.chat._id,
          content: msg,
        });
        chatNamespace.to(`chat_${socket.chat._id}`).emit("new_message", {
          _id: message._id,
          user: {
            _id: socket.user._id,
            name: socket.user.name,
          },
          content: message.content,
          createdAt: message.createdAt,
          read: message.read,
        });
        const user_objs = await User.find(
          { _id: { $in: users } },
          "_id name"
        ).lean();
        if (current_user === 0) {
          if (!(await client.sismember(socket.chat._id.toString(), users[1]))) {
            sendNotif(
              [users[1]],
              "new_message",
              `New message from [${
                user_objs[user_objs.findIndex((user) => user._id == users[0])]
                  .name
              }](${config.frontend_url}/users/${
                user_objs[user_objs.findIndex((user) => user._id == users[0])]
                  ._id
              }) on [${socket.chat.service.title}](${
                config.frontend_url
              }/services/${socket.chat.service._id})`
            );
          }
        } else {
          if (!(await client.sismember(socket.chat._id.toString(), users[0]))) {
            sendNotif(
              [users[0]],
              "new_message",
              `New message from [${
                user_objs[user_objs.findIndex((user) => user._id == users[1])]
                  .name
              }](${config.frontend_url}/users/${
                user_objs[user_objs.findIndex((user) => user._id == users[1])]
                  ._id
              }) on [${socket.chat.service.title}](${
                config.frontend_url
              }/services/${socket.chat.service._id})`
            );
          }
        }
      } catch (e) {
        console.log(e);
      }
    });
    socket.on("read_all", async () => {
      try {
        await Message.updateMany(
          { chat: socket.chat._id, user: { $ne: socket.user._id } },
          { read: true }
        );
      } catch (e) {
        console.log(e);
      }
    });
    socket.on("disconnect", async () => {
      try {
        await client.srem(
          socket.chat._id.toString(),
          socket.user._id.toString()
        );
      } catch (e) {
        console.log(e);
      }
    });
  } catch (e) {
    console.log(e);
  }
});

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
  chatNamespace,
};
