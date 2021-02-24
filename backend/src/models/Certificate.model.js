const mongoose = require("mongoose");
const Session = require("./Session.model");

const certificateSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

certificateSchema.methods.getSessions = async function () {
  try {
    const sessions = await Session.find({
      user: this.user,
      time: { $gte: this.start_date, $lte: this.end_date },
    })
      .populate("user", "_id name")
      .populate("service", "_id title")
      .lean();
    return sessions;
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = mongoose.model("Certificate", certificateSchema);
