const express = require("express");
const router = express.Router();
const cityController = require("../controller/cityController");

// router.get("/", countryController.getAllCountries);

router.get("/", cityController.getAllCity);
router.get("/:country", cityController.getCityByCountry);
router.post("/:country", cityController.addCity);
router.put("/:cityId", cityController.editCity);
router.delete("/:cityId", cityController.deleteCity);
// router.post("/add-city/:countryName", countryController.addCity);

module.exports = router;
