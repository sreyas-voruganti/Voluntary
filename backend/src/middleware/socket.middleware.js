const jwt = require("jsonwebtoken");
const config = require("../../config");
const User = require("../models/User.model");

module.exports = (socket, next) => {
  const err_obj = new Error("Authentication Error");
  const token = socket.handshake.auth.token;
  jwt.verify(token, config.secret, (err, payload) => {
    if (err) {
      console.log(err);
      err_obj.data = err;
      next(err_obj);
    }
    User.findById(payload.id)
      .then((user) => {
        socket.user = user;
        next();
      })
      .catch((err) => {
        console.log(err);
        err_obj.data = err;
        next(err_obj);
      });
  });
};
