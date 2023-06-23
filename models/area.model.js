const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AreaSchema = new Schema(
  {
    name: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    description: { type: String },
    escortCount: { type: Number },
    escortsOnTour: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Area", AreaSchema);
