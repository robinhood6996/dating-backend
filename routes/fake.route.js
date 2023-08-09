const express = require("express");
const router = express.Router();
const queryController = require("../controller/fakeController");
const { authenticate, adminAuth } = require("../middleware/tokenMiddleware");
const upload = require("multer")();

router.post("/", upload.any(), authenticate, queryController.addFakePhoto);
router.get("/", upload.any(), authenticate, queryController.getAllFakePhotos);
router.get(
  "/pending",
  upload.any(),
  authenticate,
  queryController.getAllPendingFakePhotos
);
router.put(
  "/:id",
  upload.any(),
  authenticate,
  queryController.updateFakePhotoSuspicion
);
router.delete(
  "/:id",
  upload.any(),
  authenticate,
  queryController.deleteFakePhoto
);

module.exports = router;
