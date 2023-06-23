const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CountriesSchema = new Schema({
  name: { type: String, required: true, lowercase: true },
  escortCount: { type: Number },
  cities: { type: Array },
  areas: { type: Array },
  description: { type: String },
  cityCount: { type: Number },
  escortsOnTour: { type: Number },
});

module.exports = mongoose.model("Countries", CountriesSchema);
