const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    unlisted: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "open",
      enum: ["open", "pending", "completed", "permanent"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Listing", listingSchema);
