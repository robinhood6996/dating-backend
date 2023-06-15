const express = require("express");
const router = express.Router();
const adsController = require("../controller/escortAdsController");
const { authenticate } = require("../middleware/tokenMiddleware");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, "./uploads/bank");
  },
  filename: function (request, file, callback) {
    callback(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/",
  authenticate,
  upload.any([{ name: "bank", maxCount: 1 }]),
  adsController.addEscortAd
);
router.put("/hold", authenticate, upload.any(), adsController.holdAds);
router.get("/get-all", adsController.getAllEscortsAd);
router.get("/my", authenticate, adsController.getMyAds);
router.get("/featured", adsController.getFeaturedEscorts);
router.get("/girl-of-the-month", adsController.getGirlofTheMonth);
router.put("/:adId", authenticate, adsController.updateIsPaidStatus);
router.delete("/:adId", authenticate, adsController.deleteAd);

module.exports = router;
