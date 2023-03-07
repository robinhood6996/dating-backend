const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const crypto = require("crypto");
const authController = require("../controller/authController");

// Route to register a new user
router.post("/", authController.postUser);
router.post("/register", authController.registerUser);
router.get("/user", authController.getAllUser);

module.exports = router;
