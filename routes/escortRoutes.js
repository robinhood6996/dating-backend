const express = require("express");
const router = express.Router();
const escortController = require("../controller/escortController");

router.put("/update-bio", escortController.updateEscortBiography);

module.exports = router;
