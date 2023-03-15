const express = require("express");
const router = express.Router();
const escortController = require("../controller/escortController");

router.put("/update-bio/:userId", escortController.updateEscortBiography);

module.exports = router;
