const mongoose = require("mongoose");
const config = require("../../config");
const Session = require("./Session.model");
const { promisify } = require("util");
const fs = require("fs");

const removeFileAsync = promisify(fs.unlink);
const checkFileAsync = promisify(fs.exists);

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
    user_reports: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    unlisted: {
      type: Boolean,
      default: false,
    },
    contact: {
      type: String,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
  }
);

serviceSchema.methods.userReport = async function (user_id) {
  try {
    if (this.user_reports.includes(user_id))
      throw new Error("You already reported this service.");
    this.user_reports.push(user_id);
    await this.save();
    return;
  } catch (e) {
    throw new Error(e);
  }
};

serviceSchema.methods.didReport = function (user_id) {
  return this.user_reports.includes(user_id);
};

serviceSchema.methods.updateImage = async function (new_image_name) {
  try {
    const file_path = `./../backend/uploads/${this.get("image", null, {
      getters: false,
    })}`;
    if (await checkFileAsync(file_path)) await removeFileAsync(file_path);
    this.image = new_image_name;
    await this.save();
    return this.image;
  } catch (e) {
    throw new Error(e);
  }
};

serviceSchema.methods.viewOnce = async function () {
  try {
    this.views++;
    await this.save();
    return;
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = mongoose.model("Service", serviceSchema);
