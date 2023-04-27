const express = require("express");
const router = express.Router();
const escortController = require("../controller/escortController");
const { authenticate } = require("../middleware/tokenMiddleware");
const upload = require("../middleware/upload");
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
router.get("/get-all", authenticate, escortController.getAllEscort);
router.post("/upload", upload.single("image"), escortController.uploadFile);

module.exports = router;
