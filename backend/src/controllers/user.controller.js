const { google } = require("googleapis");
const User = require("../models/User.model");
const Session = require("../models/Session.model");
const Service = require("../models/Service.model");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const axios = require("axios");

module.exports = {
  auth_google: async (req, res) => {
    try {
      const oauth2Client = new google.auth.OAuth2(
        "836522334018-qed384ump69o2g0fvubmkuidvt44bbgv.apps.googleusercontent.com",
        "_wskslSNb_7J0nwVEnqTmh36",
        `${config.temp_g_url}/auth/google`
      );
      const { tokens } = await oauth2Client.getToken(req.query.code);
      const { data: user_data } = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`
      );
      let user = await User.findOne({ google_id: user_data.id });
      const state = JSON.parse(req.query.state);
      if (user) {
        const token = jwt.sign({ id: user._id }, config.secret);
        if (!state.redirect) {
          res.redirect(
            `${config.frontend_url}/authenticate?token=${token}&id=${user._id}`
          );
        } else {
          res.redirect(
            `${config.frontend_url}/authenticate?token=${token}&id=${user._id}&r=${state.redirect}`
          );
        }
      } else {
        user = await User.create({
          name: user_data.name,
          email: user_data.email,
          google_id: user_data.id,
          pp: user_data.picture,
          google_refresh_token: tokens.refresh_token,
          google_access_token: tokens.access_token,
          acc_type: state.acc_type,
        });
        const token = jwt.sign({ id: user._id }, config.secret);
        res.redirect(
          `${config.frontend_url}/authenticate?token=${token}&id=${user._id}`
        );
      }
    } catch (err) {
      console.log(err);
      res.redirect(`${config.frontend_url}/authenticate?err=true`);
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
      res.status(200).json({
        user,
        contrib_key:
          req.user._id.toString() == user._id.toString()
            ? user.contrib_key
            : null,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  update_user: async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.user._id,
        {
          name: req.body.name,
          bio: req.body.bio,
          dob: req.body.dob,
          acc_type: req.body.acc_type,
        },
        { new: true }
      );
      res.status(200).json({
        name: user.name,
        bio: user.bio,
        dob: user.dob,
        acc_type: user.acc_type,
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },
  sync_user: async (req, res) => {
    try {
      const access_token = (
        await axios.post("https://oauth2.googleapis.com/token", {
          client_id:
            "836522334018-qed384ump69o2g0fvubmkuidvt44bbgv.apps.googleusercontent.com",
          client_secret: "_wskslSNb_7J0nwVEnqTmh36",
          grant_type: "refresh_token",
          refresh_token: req.user.google_refresh_token,
        })
      ).data.access_token;
      const { data } = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`
      );
      const user = await User.findByIdAndUpdate(
        req.user._id,
        {
          name: data.name,
          pp: data.picture,
          email: data.email,
        },
        { new: true }
      );
      res.status(200).json({
        name: user.name,
        pp: user.pp,
        email: user.email,
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },
  user_sessions: async (req, res) => {
    try {
      const user = await User.findById(
        req.params.user_id,
        "_id name contrib_key"
      ).lean();
      if (user.contrib_key !== req.query.contrib_key)
        return res.sendStatus(400);
      const services = await Service.find(
        {
          user: req.params.user_id,
        },
        "_id"
      ).lean();
      const service_ids = [];
      services.forEach((service) => {
        service_ids.push(service._id);
      });
      let sessions;
      if (req.query.start && req.query.end) {
        sessions = await Session.find({
          service: { $in: service_ids },
          status: "conf",
          time: {
            $gte: new Date(req.query.start),
            $lte: new Date(req.query.end),
          },
        })
          .populate("user", "_id name")
          .populate("service", "_id title")
          .lean();
      } else {
        sessions = await Session.find({
          service: { $in: service_ids },
          status: "conf",
        })
          .populate("user", "_id name")
          .populate("service", "_id title")
          .lean();
      }
      res.status(200).json({ sessions, user });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },
  user_search: async (req, res) => {
    try {
      const users = await User.find(
        {
          name: { $regex: req.query.q, $options: "i" },
          acc_type: "mentor",
        },
        "-google_id -google_refresh_token -contrib_key"
      ).lean();
      res.status(200).json(users);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },
  all: async (req, res) => {
    try {
      const users = await User.find(
        { acc_type: "mentor" },
        "-google_id -google_refresh_token -contrib_key"
      ).lean();
      res.status(200).json(users);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },
  wc_user_init: async (req, res) => {
    try {
      const user = await User.findById(req.user._id).lean();
      res.status(200).json(user);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },
};
