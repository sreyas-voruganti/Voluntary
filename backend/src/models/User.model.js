const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    pp: {
      type: String,
      required: true,
    },
    google_id: {
      type: Number,
      required: true,
    },
    google_refresh_token: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
