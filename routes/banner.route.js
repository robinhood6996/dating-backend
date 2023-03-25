const express = require("express");
const router = express.Router();
const Banner = require("../controller/bannerController");

// POST route to add a new banner
router.post("/", Banner.addBanner);

module.exports = router;
