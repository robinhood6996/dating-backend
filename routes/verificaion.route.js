const express = require("express");
const router = express.Router();
const multer = require("multer");
const verification = require("../controller/VerificationController");
const { authenticate } = require("../middleware/tokenMiddleware");
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

router.post("/", authenticate, upload.array, verification.verificationRequest);
router.put(
  "/update",
  authenticate,
  upload.any("photos"),
  verification.verificationApprove
);
router.get("/", authenticate, verification.getVerificationItems);
router.get("/:username", authenticate, verification.getSingleUserVerifications);

module.exports = router;
