const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { raw } = require("express");

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
    fraud_strikes: {
      type: Number,
      default: 0,
    },
    reverse_strikes: {
      type: Number,
      default: 3,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getContribHash = async function () {
  try {
    return await bcrypt.hash(this._id.toString().substring(5, 10), 2);
  } catch (e) {
    throw new Error(e);
  }
};

userSchema.methods.isContribHashValid = async function (rawHash) {
  try {
    return await bcrypt.compare(this._id.toString().substring(5, 10), rawHash);
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = mongoose.model("User", userSchema);
