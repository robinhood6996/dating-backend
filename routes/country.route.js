const express = require("express");
const router = express.Router();
const countryController = require("../controller/CountriesController");
const upload = require("multer")();
const { authenticate, adminAuth } = require("../middleware/tokenMiddleware");
router.get("/", authenticate, countryController.getAllCountries);
router.put(
  "/:id",
  authenticate,
  adminAuth,
  upload.any(),
  countryController.editCountry
);
router.post("/", authenticate, upload.any(), countryController.createCountry);
router.delete("/:id", authenticate, countryController.deleteCountry);

module.exports = router;
