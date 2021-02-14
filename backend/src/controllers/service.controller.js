const Service = require("../models/Service.model");
const Chat = require("../models/Chat.model");
const Message = require("../models/Message.model");
const User = require("../models/User.model");
const Session = require("../models/Session.model");
const Comment = require("../models/Comment.model");
const { sendNotif, chatNamespace } = require("../socket");
const config = require("../../config");
const antiFraud = require("../anti_fraud");

module.exports = {
  create: async (req, res) => {
    try {
      const service = await Service.create({
        user: req.user._id,
        title: req.body.title,
        description: req.body.description,
        tags: req.body.tags.split(", "),
        image: req.file.filename,
        unlisted: req.body.unlisted,
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
      const num_sessions = await Session.countDocuments({
        service: service._id,
        status: "conf",
      });
      const comments = await Comment.find({ service: req.params.service_id })
        .populate("user", "_id name pp")
        .sort("-createdAt")
        .lean();
      res.status(200).json({
        service,
        avg_satis: await service.getAvgSatis(),
        did_report: service.didReport(req.user._id),
        num_sessions,
        comments,
      });
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
      const filter = {
        user: req.params.user_id,
      };
      if (req.user._id.toString() != req.params.user_id)
        filter.unlisted = false;
      const services = await Service.find(filter).populate(
        "user",
        "_id name pp"
      );
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
      if (
        await antiFraud(
          req.user._id.toString(),
          req.body.time,
          req.body.duration,
          service.user.toString()
        )
      )
        return res.status(400).json({
          error: "One of the users has another session at this time.",
          code: 230,
        });
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
        unlisted: false,
      }).populate("user", "_id name pp");
      res.status(200).json(services);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },
  all_services: async (req, res) => {
    try {
      const services = await Service.find({ unlisted: false }).populate(
        "user",
        "_id name pp"
      );
      res.status(200).json(services);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },
  tag_services: async (req, res) => {
    try {
      const services = await Service.find({
        tags: { $in: req.query.t },
        unlisted: false,
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
          $match: { unlisted: false },
        },
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
  report_service: async (req, res) => {
    try {
      const service = await Service.findById(req.params.service_id);
      if (!service) return res.sendStatus(404);
      await service.userReport(req.user._id);
      res.sendStatus(200);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },
  update_service: async (req, res) => {
    try {
      const service_check = await Service.findById(
        req.params.service_id,
        "_id user"
      ).lean();
      if (service_check.user.toString() != req.user._id.toString())
        return res.sendStatus(401);
      await Service.findByIdAndUpdate(req.params.service_id, {
        title: req.body.title,
        tags: req.body.tags.split(", "),
        description: req.body.description,
        unlisted: req.body.unlisted,
      });
      const service = await Service.findById(req.params.service_id).populate(
        "user",
        "_id name pp"
      );
      res.status(200).json(service);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },
  add_comment: async (req, res) => {
    try {
      let comment = await Comment.create({
        user: req.user._id,
        service: req.params.service_id,
        content: req.body.content,
      });
      comment = await Comment.populate(comment, {
        path: "user",
        select: "_id name pp",
      });
      res.status(200).json(comment);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },
  delete_comment: async (req, res) => {
    try {
      await Comment.findByIdAndDelete(req.params.comment_id);
      res.sendStatus(200);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },
};
