const express = require("express");
const router = express.Router();
const userController = require("../controller/defaultUserController");
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
// Route to register a new user
router.put(
  "/edit",
  authenticate,
  upload.single("profileImage"),
  userController.editDefaultUser
);
router.get("/", authenticate, userController.getAllUsers);

module.exports = router;
