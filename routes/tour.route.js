const express = require("express");
const router = express.Router();
const cityTour = require("../controller/cityTourController");

router.post("/", cityTour.createCityTour);
router.get("/", cityTour.getAllCityTours);

module.exports = router;
