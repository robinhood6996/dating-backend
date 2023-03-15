const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CountriesSchema = new Schema({
  name: { type: String, required: true },
  escortCount: { type: Number },
  cities: { type: Array },
  cityCount: { type: Number },
});

module.exports = mongoose.model("Countries", CountriesSchema);
