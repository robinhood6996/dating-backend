const express = require("express");
const router = express.Router();
const countryController = require("../controller/CountriesController");

router.get("/", countryController.getAllCountries);
router.post("/create", countryController.createCountry);

module.exports = router;
