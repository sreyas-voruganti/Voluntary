const mongoose = require("mongoose");
const config = require("../../config");
const Session = require("./Session.model");

const serviceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
    tags: [
      {
        type: String,
        required: true,
      },
    ],
    image: {
      type: String,
      required: true,
      get: (rawImage) => {
        return `${config.base_url}/uploads/${rawImage}`;
      },
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
  }
);

serviceSchema.methods.getAvgSatis = async function () {
  try {
    const sessions = await Session.find(
      { service: this._id, status: "conf" },
      "satisfaction"
    ).lean();
    let num = 0;
    sessions.forEach((session) => (num += session.satisfaction));
    return Math.round((num / sessions.length) * 10) / 10;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = mongoose.model("Service", serviceSchema);
