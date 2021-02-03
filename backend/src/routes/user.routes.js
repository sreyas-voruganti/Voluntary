const express = require("express");
const UserController = require("../controllers/user.controller");
const ServiceController = require("../controllers/service.controller");
const authMiddleware = require("../middleware/auth.middleware");
const nocache = require("nocache");

const router = express.Router();
const no_cache_router = express.Router();

router.use(authMiddleware);
no_cache_router.use(nocache());
no_cache_router.use(authMiddleware);

router.get("/search", UserController.user_search);
router.get("/all", UserController.all);
router.get("/:user_id", UserController.detail);
router.get("/:user_id/services", ServiceController.user_services);
no_cache_router.get(
  "/users/me/notifications",
  UserController.user_notifications
);
router.put("/me/update", UserController.update_user);
router.post("/me/sync", UserController.sync_user);
router.get("/:user_id/sessions", UserController.user_sessions);

module.exports = {
  UserRoutes: router,
  no_cache_router,
};
