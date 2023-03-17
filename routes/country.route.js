const express = require("express");
const router = express.Router();
const countryController = require("../controller/CountriesController");

router.get("/", countryController.getAllCountries);
router.post("/", countryController.createCountry);
router.delete("/:id", countryController.deleteCountry);

module.exports = router;
