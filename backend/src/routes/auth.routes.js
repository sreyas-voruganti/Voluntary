const express = require("express");
const UserController = require("../controllers/user.controller");

const router = express.Router();

router.get("/google", UserController.auth_google);
router.get("/token/valid", UserController.token_valid);
// router.get('/token/verify', UserController.verify_token);

module.exports = router;
