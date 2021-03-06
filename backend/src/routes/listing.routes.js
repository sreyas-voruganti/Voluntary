const express = require("express");
const ListingController = require("../controllers/listing.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authMiddleware);

router.post("/create", ListingController.create);
router.get("/:listing_id", ListingController.detail);
router.put("/:listing_id", ListingController.update);

module.exports = router;
