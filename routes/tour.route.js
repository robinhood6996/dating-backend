const express = require("express");
const router = express.Router();
const cityTour = require("../controller/cityTourController");
const { authenticate } = require("../middleware/tokenMiddleware");
const upload = require("multer")();
router.post("/", authenticate, upload.any(), cityTour.createCityTour);
router.get("/", authenticate, cityTour.getAllCityTours);
router.delete("/", authenticate, cityTour.deleteCityTour);

module.exports = router;
