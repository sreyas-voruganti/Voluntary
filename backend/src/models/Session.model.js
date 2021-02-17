const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    time: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "pend_conf",
      enum: ["pend_conf", "conf", "verified"],
    },
    satisfaction: {
      type: Number,
      required: true,
    },
    vid_name: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Session", sessionSchema);
