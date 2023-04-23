const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const { authenticate } = require("../middleware/tokenMiddleware");

// Route to register a new user
router.post("/register", authController.registerUser);
router.get("/user", authController.getAllUser);
router.post("/login", authController.login);

module.exports = router;
