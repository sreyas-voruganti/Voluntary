const Service = require("../models/Service.model");
const Chat = require("../models/Chat.model");
const Message = require("../models/Message.model");
const User = require("../models/User.model");
const Session = require("../models/Session.model");
const { sendNotif, chatNamespace } = require("../socket");
const config = require("../../config");

module.exports = {
  create: async (req, res) => {
    try {
      const service = await Service.create({
        user: req.user._id,
        title: req.body.title,
        description: req.body.description,
        tags: req.body.tags.split(", "),
        image: req.file.filename,
      });
      res.status(201).json(service);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  detail: async (req, res) => {
    try {
      const service = await Service.findById(req.params.service_id).populate(
        "user",
        "_id name pp"
      );
      if (!service) return res.sendStatus(404);
      res
        .status(200)
        .json({ service: service, avg_satis: await service.getAvgSatis() });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  create_chat: async (req, res) => {
    try {
      const service = await Service.findById(
        req.params.service_id,
        "_id user title"
      ).lean();
      let chat = await Chat.find({
        service: req.params.service_id,
        user: req.user._id,
      });
      if (chat.length) return res.sendStatus(400);
      chat = await Chat.create({
        service: req.params.service_id,
        user: req.user._id,
      });
      sendNotif(
        [service.user.toString()],
        "new_chat",
        `New chat on ${service.title}`
      );
      res.status(201).json(chat);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  delete_chat: async (req, res) => {
    try {
      const chat = await Chat.findById(req.params.chat_id).populate(
        "service",
        "_id user"
      );
      if (
        chat.user.toString() != req.user._id.toString() &&
        chat.service.user.toString() != req.user._id.toString()
      )
        return res.sendStatus(401);
      await chat.remove();
      chatNamespace
        .to(`chat_${chat._id}`)
        .emit("chat_deleted", { _id: req.user._id, name: req.user.name });
      res.sendStatus(200);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  check_chat: async (req, res) => {
    try {
      const chat = await Chat.find({
        service: req.params.service_id,
        user: req.user._id,
      });
      if (chat.length)
        return res.status(200).json({ has_chat: true, id: chat[0]._id });
      return res.status(200).json({ has_chat: false });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  chat_messages: async (req, res) => {
    try {
      const messages = await Message.find({ chat: req.params.chat_id })
        .populate("user", "id name")
        .lean();
      res.status(200).json(messages);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  service_chats: async (req, res) => {
    try {
      const chats = await Chat.find(
        { service: req.params.service_id },
        "_id createdAt"
      )
        .populate("user", "_id name")
        .lean();
      res.status(200).json(chats);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  user_services: async (req, res) => {
    try {
      const services = await Service.find({
        user: req.params.user_id,
      }).populate("user", "_id name pp");
      res.status(200).json(services);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },
  create_session: async (req, res) => {
    try {
      const service = await Service.findById(req.params.service_id).lean();
      if (req.user._id == service.user)
        return res
          .status(400)
          .json({ error: "You cannot submit a session for your own service." });
      const session = await Session.create({
        user: req.user._id,
        service: service._id,
        time: req.body.time,
        duration: req.body.duration,
        satisfaction: req.body.satisfaction,
      });
      sendNotif(
        [service.user.toString()],
        "new_session_claim",
        `New session claim on [${service.title}](${config.frontend_url}/services/${service._id})`
      );
      res.status(201).json(session);
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: e.message });
    }
  },
  service_sessions: async (req, res) => {
    try {
      const pending_sessions = await Session.find(
        {
          service: req.params.service_id,
          status: "pend_conf",
        },
        "-satisfaction"
      )
        .populate("user", "id name")
        .lean();
      const confirmed_sessions = await Session.find(
        {
          service: req.params.service_id,
          status: "conf",
        },
        "-satisfaction"
      )
        .populate("user", "id name")
        .lean();
      res
        .status(200)
        .json({ pending: pending_sessions, confirmed: confirmed_sessions });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },
  confirm_session: async (req, res) => {
    // add auth check
    try {
      const session = await Session.findByIdAndUpdate(req.params.session_id, {
        status: "conf",
      });
      const new_session = await Session.findById(session._id, "-satisfaction")
        .populate("user", "id name")
        .lean();
      res.status(204).json(new_session);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },
  decline_session: async (req, res) => {
    // add auth check
    try {
      await Session.findByIdAndDelete(req.params.session_id);
      res.sendStatus(200);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },
  search_services: async (req, res) => {
    try {
      const services = await Service.find({
        $or: [
          { title: { $regex: req.query.q, $options: "i" } },
          { description: { $regex: req.query.q, $options: "i" } },
        ],
      }).populate("user", "_id name pp");
      res.status(200).json(services);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },
  all_services: async (req, res) => {
    try {
      const services = await Service.find().populate("user", "_id name pp");
      res.status(200).json(services);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },
  tag_services: async (req, res) => {
    try {
      const services = await Service.find({
        tags: { $in: req.query.t },
      }).populate("user", "_id name pp");
      res.status(200).json(services);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },
  home: async (req, res) => {
    try {
      const featured_service = await Service.findById(
        config.site_vars.featured_service
      ).populate("user", "_id name pp");
      const raw_popular_services = await Service.aggregate([
        {
          $lookup: {
            from: "sessions",
            localField: "_id",
            foreignField: "service",
            as: "sessions",
          },
        },
        {
          $set: { sessions: { $size: "$sessions" } },
        },
        {
          $sort: { sessions: -1 },
        },
        {
          $limit: 5,
        },
      ]);
      const popular_services = await User.populate(raw_popular_services, {
        path: "user",
        select: ["_id", "name", "pp"],
      });
      const sessions = await Session.find({ status: "conf" }, "_id").lean();
      res.status(200).json({
        featured_service,
        popular_services,
        total_contrib: sessions.length,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
