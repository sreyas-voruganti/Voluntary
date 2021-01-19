const Chat = require("../models/Chat.model");

module.exports = (socket, next) => {
  const err_obj = new Error("Chat Error");
  Chat.findById(socket.handshake.query.chat)
    .populate("service", "_id user title")
    .lean()
    .then((chat) => {
      socket.chat = chat;
      next();
    })
    .catch((err) => {
      console.log(err);
      err_obj.data = err;
      next(err_obj);
    });
};
