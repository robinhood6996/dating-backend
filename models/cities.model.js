const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CitiesSchema = new Schema(
  {
    name: { type: String, required: true, lowercase: true },
    country: { type: String, required: true, lowercase: true },
    areas: { type: Array, default: [] },
    description: { type: String },
    escortCount: { type: Number },
    escortsOnTour: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cities", CitiesSchema);
