const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CitiesSchema = new Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  escortCount: { type: Number },
  escortsOnTour: { type: Number },
});

module.exports = mongoose.model("Cities", CitiesSchema);
