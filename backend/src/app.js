const express = require("express");
const app = express();
const http = require("http").Server(app);
const AuthRoutes = require("./routes/auth.routes");
const ServiceRoutes = require("./routes/service.routes");
const UserRoutes = require("./routes/user.routes");
const cors = require("cors");
const morgan = require("morgan");
const socket_auth = require("./middleware/socket.middleware");
const socket_chat = require("./middleware/socket_chat");
const Message = require("./models/Message.model");
const asyncRedis = require("async-redis");
const client = asyncRedis.createClient();

client.on("error", (err) => {
  console.log("Redis Error " + err);
});

const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

// Define Namespaces
const chatNamespace = io.of("/chat");
const notifNamespace = io.of("/notifications");

// Middleware and Settings
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.disable("x-powered-by");
app.use(morgan(":method :url :status - :response-time"));
app.use("/uploads", express.static("uploads"));
chatNamespace.use(socket_auth);
chatNamespace.use(socket_chat);
notifNamespace.use(socket_auth);

// Routes
app.use("/auth", AuthRoutes);
app.use("/services", ServiceRoutes);
app.use("/users", UserRoutes);

// Listen to Events
chatNamespace.on("connection", async (socket) => {
  try {
    await client.sadd(socket.chat._id.toString(), socket.user._id.toString());
    socket.join(`chat_${socket.chat._id}`);
    socket.on("send_message", async (msg) => {
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
        });
        notifNamespace
          .to(`notif_${socket.chat.service.user}`)
          .emit("new_notif", "new chat message test");
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

module.exports = {
  http,
  notifNamespace,
};
