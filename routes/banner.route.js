const express = require("express");
const router = express.Router();
const Banner = require("../controller/bannerController");
const upload = require("multer")();
// POST route to add a new banner
router.post("/", upload.any(), Banner.addBanner);
router.get("/", Banner.getAllBanners);
router.put("/:bannerId", upload.any(), Banner.editBanner);
router.delete("/:bannerId", Banner.deleteBanner);

module.exports = router;
