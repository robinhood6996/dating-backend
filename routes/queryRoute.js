const express = require("express");
const router = express.Router();
const queryController = require("../controller/queryController");
const { authenticate, adminAuth } = require("../middleware/tokenMiddleware");
const upload = require("multer")();

router.post("/", upload.any(), queryController.createQuery);

module.exports = router;
