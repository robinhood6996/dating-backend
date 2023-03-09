const express = require("express");
const router = express.Router();
const categoryController = require("../controller/categoryController");

router.post("/category", categoryController.createCategory);
// router.patch("/category", settingsController.createCategory);
router.get("/category", categoryController.getAllCategories);
router.put("/category/:id", categoryController.updateCategory);
router.delete("/category/:id", categoryController.deleteCategory);

module.exports = router;
