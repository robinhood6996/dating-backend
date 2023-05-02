const express = require("express");
const router = express.Router();
const countryController = require("../controller/CountriesController");
const upload = require("multer")();
router.get("/", countryController.getAllCountries);
router.post("/", upload.any(), countryController.createCountry);
router.delete("/:id", countryController.deleteCountry);

module.exports = router;
