const express = require("express");
const router = express.Router();
const cityController = require("../controller/cityController");
const { authenticate } = require("../middleware/tokenMiddleware");
const upload = require("multer")();

// router.get("/", countryController.getAllCountries);

router.get("/", cityController.getAllCity);
router.get("/:country", cityController.getCityByCountry);
router.post("/:country", upload.any(), cityController.addCity);
router.put("/:cityId", authenticate, upload.any(), cityController.editCity);
router.delete("/:cityId", cityController.deleteCity);
// router.post("/add-city/:countryName", countryController.addCity);

module.exports = router;
