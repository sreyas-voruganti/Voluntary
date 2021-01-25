const mongoose = require("mongoose");
const Message = require("./Message.model");

const chatSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

chatSchema.pre("remove", function (next) {
  Message.deleteMany({ chat: this._id })
    .then(() => {
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});

module.exports = mongoose.model("Chat", chatSchema);
