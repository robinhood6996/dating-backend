const express = require("express");
const router = express.Router();
const Banner = require("../controller/bannerController");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, "./uploads/banner");
  },
  filename: function (request, file, callback) {
    console.log(file);
    callback(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });
// POST route to add a new banner
router.post("/", upload.single("image"), Banner.addBanner);
router.get("/", Banner.getAllBanners);
router.put("/:bannerId", upload.any(), Banner.editBanner);
router.delete("/:bannerId", Banner.deleteBanner);

module.exports = router;
