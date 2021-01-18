const express = require("express");
const ServiceController = require("../controllers/service.controller");
const authMiddleware = require("../middleware/auth.middleware");
const upload = require("../middleware/upload");

const router = express.Router();

router.use(authMiddleware);

router.post("/create", upload.single("image"), ServiceController.create);
router.get("/:service_id", ServiceController.detail);
router.post("/:service_id/chats/start", ServiceController.create_chat);
router.get("/:service_id/chats/check", ServiceController.check_chat);
router.get("/chats/:chat_id/messages", ServiceController.chat_messages);
router.get("/:service_id/chats/all", ServiceController.service_chats);

module.exports = router;