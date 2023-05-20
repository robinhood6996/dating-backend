const express = require("express");
const router = express.Router();
const userController = require("../controller/defaultUserController");
const { authenticate } = require("../middleware/tokenMiddleware");
const upload = require("multer")();
// Route to register a new user
router.put("/edit", authenticate, userController.editDefaultUser);

module.exports = router;
