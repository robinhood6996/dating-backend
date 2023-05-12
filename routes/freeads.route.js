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
    console.log(file);
    callback(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post(
  "/create",
  authenticate,
  upload.any("photos"),
  freeAdController.createAd
);
router.put("/update/:id", upload.any(), freeAdController.editFreeAd);
router.get("/active", freeAdController.activeAds);
router.get("/inactive", freeAdController.inactiveAds);
router.get("/", freeAdController.getAll);
router.get("/:adId", freeAdController.getSingleAd);
router.delete("/:adId", freeAdController.deleteAd);

module.exports = router;
