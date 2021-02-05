const express = require("express");
const ServiceController = require("../controllers/service.controller");
const authMiddleware = require("../middleware/auth.middleware");
const upload = require("../middleware/upload");

const router = express.Router();

router.use(authMiddleware);

router.post("/create", upload.single("image"), ServiceController.create);
router.get("/search", ServiceController.search_services);
router.get("/tags", ServiceController.tag_services);
router.get("/all", ServiceController.all_services);
router.get("/home", ServiceController.home);
router.get("/:service_id", ServiceController.detail);
router.post("/:service_id/chats/start", ServiceController.create_chat);
router.get("/:service_id/chats/check", ServiceController.check_chat);
router.get("/chats/:chat_id/messages", ServiceController.chat_messages);
router.delete("/chats/:chat_id/delete", ServiceController.delete_chat);
router.get("/:service_id/chats/all", ServiceController.service_chats);
router.post("/:service_id/sessions", ServiceController.create_session);
router.get("/:service_id/sessions", ServiceController.service_sessions);
router.post("/sessions/:session_id/confirm", ServiceController.confirm_session);
router.delete(
  "/sessions/:session_id/decline",
  ServiceController.decline_session
);
router.post("/:service_id/report", ServiceController.report_service);
router.put("/:service_id/update", ServiceController.update_service);

module.exports = router;
