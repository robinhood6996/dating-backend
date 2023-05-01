const Category = require("../models/category.model");
const mongoose = require("mongoose");
const { AlreayExist } = require("../helpers/errors");
// Category Created
exports.createCategory = async (req, res) => {
  try {
    if (req.body) {
      let exist = await Category.findOne({ name: req.body.name });
      if (!exist) {
        let category = new Category({
          name: req.body.name,
          subCategories: [],
        });

        await category.save().then(() => {
          res
            .status(201)
            .json({ category: category, message: "Category added" });
        });
      } else {
        res.status(400).json(AlreayExist("Category"));
      }
    } else {
      res.status(400).json({ message: "Category name is required" });
    }
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      // handle validation error
      const errors = Object.values(err.errors).map((val) => val.message);
      res.status(400).json({ message: errors });
    }
    res.status(500).json("Internal server error");
  }
};

//Update Category
exports.updateCategory = async (req, res) => {
  try {
    await Category.updateOne(
      { _id: req.params.id },
      {
        $set: {
          name: req.body.name,
        },
      }
    )
      .then(() => {
        res.status(200).json({ message: "Category updated" });
      })
      .catch((error) => {
        if (error) {
          res.status(500).json({ error: error });
        }
      });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

//Delete Category
exports.deleteCategory = async (req, res) => {
  try {
    await Category.deleteOne({ _id: req.params.id })
      .then(() => {
        res.status(200).json({ message: "Category deleted" });
      })
      .catch((error) => {
        res.status(400).json({ error: "Category not found" });
      });
  } catch (err) {}
};

//Get ALl Category
exports.getAllCategories = async (req, res) => {
  try {
    let allCategories = await Category.find({});
    res.status(200).json(allCategories);
  } catch (err) {
    res.status(500).json("Something went wrong");
  }
};
