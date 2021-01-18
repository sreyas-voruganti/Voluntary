const express = require("express");
const app = express();
const http = require("http").Server(app);
const AuthRoutes = require("./routes/auth.routes");
const ServiceRoutes = require("./routes/service.routes");
const UserRoutes = require("./routes/user.routes");
const cors = require("cors");
const morgan = require("morgan");
const socket_auth = require("./middleware/socket.middleware");
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

// Middleware and Settings
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.disable("x-powered-by");
app.use(morgan(":method :url :status - :response-time"));
app.use("/uploads", express.static("uploads"));
chatNamespace.use(socket_auth);

// Routes
app.use("/auth", AuthRoutes);
app.use("/services", ServiceRoutes);
app.use("/users", UserRoutes);

// Listen to Events
chatNamespace.on("connection", async (socket) => {
  try {
    socket.chat_id = socket.handshake.query.chat;
    await client.sadd(socket.chat_id.toString(), socket.user._id.toString());
    socket.join(`chat_${socket.chat_id}`);
    socket.on("send_message", async (msg) => {
      try {
        const message = await Message.create({
          user: socket.user._id,
          chat: socket.chat_id,
          content: msg,
        });
        chatNamespace.to(`chat_${socket.chat_id}`).emit("new_message", {
          _id: message._id,
          user: {
            _id: socket.user._id,
            name: socket.user.name,
          },
          content: message.content,
          createdAt: message.createdAt,
        });
      } catch (e) {
        console.log(e);
      }
    });
    socket.on("disconnect", async () => {
      try {
        await client.srem(
          socket.chat_id.toString(),
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

exports.http = http;
