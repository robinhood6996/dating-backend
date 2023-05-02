const express = require("express");
const router = express.Router();
const freeAdController = require("../controller/freeAdController");
const { authenticate } = require("../middleware/tokenMiddleware");
router.post("/create", authenticate, freeAdController.createAd);
router.put("/update/:id", freeAdController.editFreeAd);
router.get("/active", freeAdController.activeAds);
router.get("/inactive", freeAdController.inactiveAds);
router.get("/", freeAdController.getAll);
router.get("/:adId", freeAdController.getSingleAd);
router.delete("/:adId", freeAdController.deleteAd);

module.exports = router;
