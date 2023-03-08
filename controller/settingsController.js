const Category = require("../models/settings.model");

exports.createCategory = async (req, res) => {
  try {
    if (req.body) {
      if (req.body.parentId) {
        let hasParent = await Category.findById(req.body.parentId);

        if (hasParent) {
          let existingCat = { ...hasParent._doc };

          let subCategories = existingCat.subCategories;
          let existInSubCat = subCategories.find(
            (subCat) => subCat.name === req.body.name
          );

          if (!existInSubCat) {
            let newSub = {
              id: subCategories.length + 1,
              name: req.body.name,
            };
            subCategories.push(newSub);

            const category = new Category({
              ...existingCat,
              subCategories,
            });

            await category
              .updateOne()
              .then((result) => {
                console.log("existInSubCat", result);
                res.status(200).json({ category, message: "Category updated" });
              })
              .catch((err) => {
                console.log("err", err);
              });
          } else {
            res.status(400).json({ message: "Subcategory exist" });
          }
        } else {
          res.status(400).json("Bad request");
        }
      } else {
        let exist = await Category.findOne({ name: req.body.name });
        console.log("exist", exist);
        if (!exist) {
          let category = new Category({
            name: req.body.name,
            parentId: null,
            subCategories: [],
          });
          await category.save().then(() => {
            res
              .send(201)
              .json({ category: category, message: "Category added" });
          });
        } else {
          res.status(400).json({ message: "Sorry category already exist" });
        }
      }
    } else {
      res.status(400).json("Bad request");
    }
  } catch (error) {
    res.status(500).json({ message: "Sorry something went wrong" });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    let allCategories = await Category.find({});
    res.status(200).json(allCategories);
  } catch (err) {
    res.status(500).json("Something went wrong");
  }
};
