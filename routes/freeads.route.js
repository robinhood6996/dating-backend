const express = require("express");
const router = express.Router();
const freeAdController = require("../controller/freeAdController");

router.post("/create", freeAdController.createAd);
router.put("/update/:id", freeAdController.editFreeAd);
router.get("/active", freeAdController.activeAds);
router.get("/inactive", freeAdController.inactiveAds);
router.get("/", freeAdController.getAll);

module.exports = router;
