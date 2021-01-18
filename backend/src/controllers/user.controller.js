const { google } = require("googleapis");
const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const axios = require("axios");

module.exports = {
  auth_google: async (req, res) => {
    try {
      const oauth2Client = new google.auth.OAuth2(
        "836522334018-qed384ump69o2g0fvubmkuidvt44bbgv.apps.googleusercontent.com",
        "_wskslSNb_7J0nwVEnqTmh36",
        "http://localhost:8000/auth/google"
      );
      const { tokens } = await oauth2Client.getToken(req.query.code);
      const { data: user_data } = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`
      );
      let user = await User.findOne({ google_id: user_data.id });
      if (user) {
        const token = jwt.sign({ id: user._id }, config.secret);
        res.redirect(
          `http://localhost:8080/authenticate?token=${token}&id=${user._id}`
        );
      } else {
        user = await User.create({
          name: user_data.name,
          email: user_data.email,
          google_id: user_data.id,
          pp: user_data.picture,
          google_refresh_token: tokens.refresh_token,
          google_access_token: tokens.access_token,
        });
        const token = jwt.sign({ id: user._id }, config.secret);
        res.redirect(
          `http://localhost:8080/authenticate?token=${token}&id=${user._id}`
        );
      }
    } catch (err) {
      res.redirect(`http://localhost:8080/authenticate?err=true`);
    }
  },
  token_valid: (req, res) => {
    const token = req.query.token;
    if (!token)
      return res.status(400).json({ error: "Token query param is required." });
    jwt.verify(token, config.secret, (err) => {
      if (err) return res.status(200).json({ valid: false });
      res.status(200).json({ valid: true });
    });
  },
  detail: async (req, res) => {
    try {
      const user = await User.findById(
        req.params.user_id,
        "-google_refresh_token -google_access_token -google_id"
      );
      if (!user) return res.sendStatus(404);
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
