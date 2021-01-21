const Service = require("../models/Service.model");
const Chat = require("../models/Chat.model");
const Message = require("../models/Message.model");
const Session = require("../models/Session.model");
const { sendNotif } = require("../socket");

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
        "id name pp"
      );
      if (!service) return res.sendStatus(404);
      res.status(200).json(service);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  create_chat: async (req, res) => {
    try {
      let chat = await Chat.find({
        service: req.params.service_id,
        user: req.user._id,
      });
      if (chat.length) return res.sendStatus(400);
      chat = await Chat.create({
        service: req.params.service_id,
        user: req.user._id,
      });
      res.status(201).json(chat);
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
        `New session claim on [${service.title}](http://localhost:8080/services/${service._id})`
      );
      res.status(201).json(session);
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: e.message });
    }
  },
};
