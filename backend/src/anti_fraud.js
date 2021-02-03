const Session = require("./models/Session.model");
const User = require("./models/User.model");

async function antiFraud(session, requsting_user) {
  try {
    // Declare Scope Vars
    const SERVICE = await Service.findById(session.service)
      .populate("user", "_id")
      .lean();
    const REQUESTING_USER_ID = requsting_user;
    const END_USER_ID = SERVICE.user._id;
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = antiFraud;
