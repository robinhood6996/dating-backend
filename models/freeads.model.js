const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const freeAdSchema = new Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  city: { type: String },
  description: { type: String, required: true },
  phone: { type: Number, required: true },
  email: { type: Number },
  duration: { type: number },
  photo1: { type: String, required: true },
  photo2: { type: String },
  photo3: { type: String },
});

module.exports = mongoose.model("FreeAd", freeAdSchema);
