const Session = require("./models/Session.model");
const { add } = require("date-fns");

async function antiFraud(client_id, session_time, session_duration, host_id) {
  try {
    const start_time = new Date(session_time);
    const end_time = add(start_time, { minutes: session_duration });
    const num_sessions = await Session.countDocuments({
      user: { $in: [client_id, host_id] },
      time: { $gte: start_time, $lte: end_time },
      status: "conf",
    });
    if (num_sessions) return true;
    return false;
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = antiFraud;
