const config = require("../../config");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "Authentication required." });
  }
  jwt.verify(token, config.secret, (err, payload) => {
    if (err) {
      return res.status(400).json({ error: "Invalid token," });
    }
    User.findById(payload.id)
      .then((user) => {
        if (!user) return res.status(400).json({ error: "Invalid token," });
        req.user = user;
        next();
      })
      .catch((err) => res.status(500).json(err.message));
  });
};
