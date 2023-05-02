const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const { authenticate } = require("../middleware/tokenMiddleware");
const upload = require("multer")();
// Route to register a new user
router.post("/register", upload.any(), authController.registerUser);
router.get("/user", authController.getAllUser);
router.post("/login", upload.any(), authController.login);
router.get("/logout", authController.logout);
router.post(
  "/delete-user",
  authenticate,
  upload.any(),
  authController.deleteUser
);

module.exports = router;
