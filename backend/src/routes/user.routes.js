const express = require("express");
const UserController = require("../controllers/user.controller");
const ServiceController = require("../controllers/service.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/search", UserController.user_search);
router.get("/all", UserController.all);
router.get("/:user_id", UserController.detail);
router.get("/:user_id/services", ServiceController.user_services);
router.put("/me/update", UserController.update_user);
router.post("/me/sync", UserController.sync_user);
router.get("/me/init", UserController.wc_user_init);
router.get("/:user_id/sessions", UserController.user_sessions);

module.exports = router;
