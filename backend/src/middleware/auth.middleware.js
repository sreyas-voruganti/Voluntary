const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "Authentication required." });
  }
  jwt.verify(token, process.env.SECRET, (err, payload) => {
    if (err) {
      if (err.name == "TokenExpiredError")
        return res
          .status(400)
          .json({ expired: true, error: `Token expired at ${err.expiredAt}` });
      return res.status(400).json({ error: "Invalid token" });
    }
    User.findById(payload.id)
      .then((user) => {
        if (!user) return res.status(400).json({ error: "Invalid token" });
        req.user = user;
        next();
      })
      .catch((err) => res.status(500).json(err.message));
  });
};
