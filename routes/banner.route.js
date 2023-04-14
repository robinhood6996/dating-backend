const express = require("express");
const router = express.Router();
const Banner = require("../controller/bannerController");

// POST route to add a new banner
router.post("/", Banner.addBanner);
router.get("/", Banner.getAllBanners);
router.put("/:bannerId", Banner.editBanner);
router.delete("/:bannerId", Banner.deleteBanner);

module.exports = router;
