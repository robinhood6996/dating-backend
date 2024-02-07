const express = require("express");
const router = express.Router();
const escortController = require("../controller/escortController");
const { authenticate } = require("../middleware/tokenMiddleware");
// const upload = require("../middleware/upload");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, "./uploads/escort");
  },
  filename: function (request, file, callback) {
    callback(null, Date.now() + "-" + file.originalname);
  },
});
const storageVideos = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, "./uploads/escort/videos");
  },
  filename: function (request, file, callback) {
    callback(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });
const uploadVideos = multer({ storage: storageVideos });
// const fUpload = multer({ dest: "../uploads/" });
router.put(
  "/update-bio",
  authenticate,
  upload.any(),
  escortController.updateBiographyData
);
router.put(
  "/update-physical",
  authenticate,
  upload.any(),
  escortController.updatePhysicalData
);
router.put(
  "/update-additional-data",
  authenticate,
  upload.any(),
  escortController.updateAdditionalData
);
router.put(
  "/working-cities",
  authenticate,
  upload.any(),
  escortController.workingCity
);
router.put(
  "/services",
  authenticate,
  upload.any(),
  escortController.updateServices
);
router.put(
  "/working-hours",
  authenticate,
  upload.any(),
  escortController.workingHours
);
router.put("/rates", authenticate, upload.any(), escortController.updateRates);
router.put(
  "/contact",
  authenticate,
  upload.any(),
  escortController.updateContactData
);
router.get("/", authenticate, escortController.getEscort);
router.get("/get-all", escortController.getAllEscort);
router.get("/geo-escorts", escortController.getGeoEscorts);
router.get("/videos", escortController.getEscortVideos);
router.get("/photo-reviews", escortController.getEscortPhotos);
router.get("/get-inactive", escortController.getInactiveEscorts);
router.get("/profile", authenticate, escortController.getEscortProfile);
router.get("/category/:cat", escortController.getEscortByCat);
router.get("/filter", escortController.getEscorts);
router.get("/search-query", escortController.escortCategories);
router.post(
  "/upload",
  authenticate,
  upload.any("photos"),
  escortController.uploadFile
);
router.post(
  "/upload/videos",
  authenticate,
  uploadVideos.any("videos"),
  escortController.uploadVideos
);
router.post(
  "/upload/profile-image",
  authenticate,
  upload.any("image"),
  escortController.uploadProfileImage
);
router.delete(
  "/upload",
  authenticate,
  upload.any("image"),
  escortController.deleteImage
);
router.delete(
  "/upload/videos",
  authenticate,
  upload.any("video"),
  escortController.deleteVideo
);
router.delete(
  "/delete",
  authenticate,
  upload.any(),
  escortController.deleteEscort
);
router.put(
  "/update-status",
  authenticate,
  upload.any(),
  escortController.updateStatus
);
router.post(
  "/rate-photo",
  authenticate,
  upload.any(),
  escortController.ratePhotos
);

module.exports = router;
