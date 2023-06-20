const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AreaSchema = new Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  escortCount: { type: Number },
  escortsOnTour: { type: Number },
});

module.exports = mongoose.model("Area", AreaSchema);
