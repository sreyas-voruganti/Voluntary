const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  type: String,
});

module.exports = mongoose.model("Notification", notificationSchema);
