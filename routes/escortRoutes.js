const express = require("express");
const router = express.Router();
const escortController = require("../controller/escortController");
const { authenticate } = require("../middleware/tokenMiddleware");
const upload = require("../middleware/upload");
// const multer = require("multer");
// const fUpload = multer({ dest: "../uploads/" });
router.put("/update-bio", authenticate, escortController.updateBiographyData);
router.put(
  "/update-physical",
  authenticate,
  escortController.updatePhysicalData
);
router.put(
  "/update-additional-data",
  authenticate,
  escortController.updateAdditionalData
);
router.get("/get-all", escortController.getAllEscort);
router.post(
  "/upload-file",
  // upload.single("image"),
  escortController.uploadFile
);
router.get("/", escortController.getEscort);
router.get("/filter", escortController.getEscorts);
router.post("/upload", escortController.uploadFile);

module.exports = router;
