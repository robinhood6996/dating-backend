const express = require("express");
const router = express.Router();
const freeAdController = require("../controller/freeAdController");
const { authenticate } = require("../middleware/tokenMiddleware");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, "./uploads/escort");
  },
  filename: function (request, file, callback) {
    callback(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post(
  "/create",
  authenticate,
  upload.array("photos"),
  freeAdController.createAd
);
router.put(
  "/update/:id",
  authenticate,
  upload.any(),
  freeAdController.editFreeAd
);
router.get("/active", authenticate, freeAdController.activeAds);
router.get("/inactive", authenticate, freeAdController.inactiveAds);
router.get("/", freeAdController.getAll);
router.get("/my", authenticate, freeAdController.getMyAds);
router.get("/:adId", freeAdController.getSingleAd);
router.delete("/:adId", authenticate, freeAdController.deleteAd);

module.exports = router;
