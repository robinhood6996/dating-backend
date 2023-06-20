const express = require("express");
const router = express.Router();
const areaController = require("../controller/areaController");
const { authenticate } = require("../middleware/tokenMiddleware");
const upload = require("multer")();

// router.get("/", countryController.getAllCountries);

router.get("/", areaController.getAllCity);
// router.get("/:country", cityController.getCityByCountry);
router.post("/", upload.any(), areaController.addArea);
// router.put("/:cityId", authenticate, upload.any(), cityController.editCity);
// router.delete("/:cityId", cityController.deleteCity);
// router.post("/add-city/:countryName", countryController.addCity);

module.exports = router;
