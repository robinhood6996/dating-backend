const express = require("express");
const router = express.Router();
const countryController = require("../controller/CountriesController");
const upload = require("multer")();
const { authenticate, adminAuth } = require("../middleware/tokenMiddleware");
router.get("/", countryController.getAllCountries);
router.put(
  "/:id",
  authenticate,
  adminAuth,
  upload.any(),
  countryController.editCountry
);
router.post(
  "/",
  authenticate,
  adminAuth,
  upload.any(),
  countryController.createCountry
);
router.delete("/:id", authenticate, adminAuth, countryController.deleteCountry);

module.exports = router;
