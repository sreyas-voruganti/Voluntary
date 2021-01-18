const mongoose = require("mongoose");
const config = require("../../config");

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

module.exports = mongoose.model("Service", serviceSchema);
