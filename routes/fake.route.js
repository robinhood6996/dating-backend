const express = require("express");
const router = express.Router();
const queryController = require("../controller/fakeController");
const { authenticate, adminAuth } = require("../middleware/tokenMiddleware");
const upload = require("multer")();

router.post("/", upload.any(), authenticate, queryController.addFakePhoto);

module.exports = router;
