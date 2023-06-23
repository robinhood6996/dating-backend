const express = require("express");
const router = express.Router();
const areaController = require("../controller/areaController");
const { authenticate, adminAuth } = require("../middleware/tokenMiddleware");
const upload = require("multer")();

// router.get("/", countryController.getAllCountries);

router.get("/", areaController.getAllCity);
router.get("/get-one", areaController.getSingleArea);
// router.get("/:country", cityController.getCityByCountry);
router.post("/", adminAuth, upload.any(), areaController.addArea);
router.put("/:cityId", adminAuth, upload.any(), areaController.editCity);
router.delete("/:cityId", areaController.deleteCity);
// router.post("/add-city/:countryName", countryController.addCity);

module.exports = router;
