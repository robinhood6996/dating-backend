const express = require("express");
const router = express.Router();
const adsController = require("../controller/escortAdsController");
const { authenticate } = require("../middleware/tokenMiddleware");

const upload = require("multer")();

router.post("/", authenticate, upload.any(), adsController.addEscortAd);
router.put("/:adId", authenticate, adsController.updateIsPaidStatus);
router.get("/get-all", adsController.getAllEscortsAd);
router.get("/my", authenticate, adsController.getMyAds);
router.get("/featured", adsController.getFeaturedEscorts);
router.get("/girl-of-the-month", adsController.getGirlofTheMonth);

module.exports = router;
