const express = require("express");
const router = express.Router();
const settingsController = require("../controller/settingsController");

router.post("/category", settingsController.createCategory);
router.patch("/category", settingsController.createCategory);
router.get("/category", settingsController.getAllCategories);

module.exports = router;
