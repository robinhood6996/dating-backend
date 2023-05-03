const express = require("express");
const router = express.Router();
const escortController = require("../controller/escortController");
const { authenticate } = require("../middleware/tokenMiddleware");
// const upload = require("../middleware/upload");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, "./uploads/");
  },
  filename: function (request, file, callback) {
    console.log(file);
    callback(null, Date.now() + "-" + file.originalname);
  },
});

var upload = multer({ storage: storage });
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
router.get("/get-all", escortController.getAllEscort);
router.get("/", escortController.getEscort);
router.get("/category/:cat", escortController.getEscortByCat);
router.get("/filter", escortController.getEscorts);
router.post(
  "/upload",
  upload.array([{ fieldName: "images", maxCount: 20 }]),
  escortController.uploadFile
);

module.exports = router;
