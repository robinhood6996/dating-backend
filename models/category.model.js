const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Schema
const categorySchema = new Schema(
  {
    name: { type: String, required: true },
    parentId: { type: String, required: false },
    subCategories: { type: Array, required: false },
  },
  {}
);

module.exports = mongoose.model("Category", categorySchema);
