const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `img_${Math.floor(Math.random() * 1000)}_${Date.now()}.jpg`);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
