const mongoose = require("mongoose");
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
    contrib_key: {
      type: String,
      default: Math.random().toString(36).substring(2),
    },
    acc_type: {
      type: String,
      default: "client",
      enum: ["client", "mentor"],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("age").get(function () {
  return this.date ? differenceInYears(new Date(), new Date(this.dob)) : null;
});

module.exports = mongoose.model("User", userSchema);
