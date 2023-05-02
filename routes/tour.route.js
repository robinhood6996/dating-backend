const express = require("express");
const router = express.Router();
const cityTour = require("../controller/cityTourController");
const upload = require("multer")();
router.post("/", upload.any(), cityTour.createCityTour);
router.get("/", cityTour.getAllCityTours);

module.exports = router;
