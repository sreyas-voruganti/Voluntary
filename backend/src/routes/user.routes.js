const express = require("express");
const UserController = require("../controllers/user.controller");
const ServiceController = require("../controllers/service.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/:user_id", UserController.detail);
router.get("/:user_id/services", ServiceController.user_services);
router.get("/me/notifications", UserController.user_notifications);

module.exports = router;
