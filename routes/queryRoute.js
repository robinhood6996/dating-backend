const express = require("express");
const router = express.Router();
const queryController = require("../controller/queryController");
const { authenticate, adminAuth } = require("../middleware/tokenMiddleware");
const upload = require("multer")();

// router.get("/", countryController.getAllCountries);

// router.get("/", areaController.getAllCity);
// router.get("/get-one", areaController.getSingleArea);
// router.get("/:country", cityController.getCityByCountry);
router.post("/", authenticate, upload.any(), queryController.createQuery);
// router.put("/:cityId", adminAuth, upload.any(), areaController.editCity);
// router.delete("/:cityId", areaController.deleteCity);
// router.post("/add-city/:countryName", countryController.addCity);

module.exports = router;
