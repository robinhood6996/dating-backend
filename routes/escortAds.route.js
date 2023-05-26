const express = require("express");
const router = express.Router();
const adsController = require("../controller/escortAdsController");
const { authenticate } = require("../middleware/tokenMiddleware");
const upload = require("multer")();

router.post("/upload", authenticate, upload.any(), adsController.addEscortAd);

module.exports = router;
