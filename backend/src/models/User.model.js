const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { differenceInYears } = require("date-fns");

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
    dob: {
      type: Date,
      default: null,
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

userSchema.virtual("age").get(function () {
  return this.date ? differenceInYears(new Date(), new Date(this.dob)) : null;
});

module.exports = mongoose.model("User", userSchema);
