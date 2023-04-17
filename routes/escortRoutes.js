const express = require("express");
const router = express.Router();
const escortController = require("../controller/escortController");
const { authenticate } = require("../middleware/tokenMiddleware");

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

module.exports = router;
