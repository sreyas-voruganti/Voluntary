const Listing = require("../models/Listing.model");

module.exports = {
  create: async (req, res) => {
    try {
      const listing = await Listing.create({
        user: req.user._id,
        time: req.body.time,
        title: req.body.title,
        description: req.body.description,
        bio: req.body.bio,
        contact: req.body.contact,
      });
      res.status(201).json(listing);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },
  detail: async (req, res) => {
    try {
      const listing = await Listing.findById(req.params.listing_id)
        .populate("user", "_id pp name")
        .lean();
      res.status(200).json(listing);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },
  update: async (req, res) => {
    try {
      let listing = await Listing.findById(
        req.params.listing_id,
        "_id user"
      ).lean();
      if (listing.user != req.user._id.toString()) return res.sendStatus(401);
      await Listing.findByIdAndUpdate(req.params.listing_id, {
        title: req.body.title,
        time: req.body.time,
        description: req.body.description,
        bio: req.body.bio,
        contact: req.body.contact,
        unlisted: req.body.unlisted,
      });
      listing = await Listing.findById(req.params.listing_id)
        .populate("user", "_id pp name")
        .lean();
      res.status(200).json(listing);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },
};
