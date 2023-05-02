const express = require("express");
const router = express.Router();
const categoryController = require("../controller/categoryController");
const upload = require("multer")();
router.post("/category", upload.any(), categoryController.createCategory);
// router.patch("/category", settingsController.createCategory);
router.get("/category", categoryController.getAllCategories);
router.put("/category/:id", upload.any(), categoryController.updateCategory);
router.delete("/category/:id", categoryController.deleteCategory);

module.exports = router;
