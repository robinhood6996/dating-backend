const express = require("express");
const router = express.Router();
const cityTour = require("../controller/cityTourController");
const { authenticate } = require("../middleware/tokenMiddleware");
const upload = require("multer")();
router.post("/", authenticate, upload.any(), cityTour.createCityTour);
router.get("/", cityTour.getAllCityTours);
router.get("/my", authenticate, cityTour.getUserCityTour);
router.get("/escort/:userName", authenticate, cityTour.getEscortTours);
router.delete("/", authenticate, cityTour.deleteCityTour);

module.exports = router;
