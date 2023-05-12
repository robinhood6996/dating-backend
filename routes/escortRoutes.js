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
    console.log(file);
    callback(null, Date.now() + "-" + file.originalname);
  },
});
const storageVideos = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, "./uploads/escort/videos");
  },
  filename: function (request, file, callback) {
    console.log(file);
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
router.get("/get-all", escortController.getAllEscort);
router.get("/", authenticate, escortController.getEscort);
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

module.exports = router;
