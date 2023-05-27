const express = require("express");
const router = express.Router();
const adsController = require("../controller/escortAdsController");
const { authenticate } = require("../middleware/tokenMiddleware");

const upload = require("multer")();

router.post("/", authenticate, upload.any(), adsController.addEscortAd);
router.get("/featured", authenticate, adsController.getFeaturedEscorts);

module.exports = router;
