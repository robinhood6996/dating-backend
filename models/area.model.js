const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AreaSchema = new Schema(
  {
    name: { type: String, required: true, lowercase: true },
    city: { type: String, required: true, lowercase: true },
    country: { type: String, required: true, lowercase: true },
    description: { type: String },
    escortCount: { type: Number },
    escortsOnTour: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Area", AreaSchema);
