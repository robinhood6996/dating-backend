const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Schema
const EscortProfileSchema = new Schema({
  //Biography
  name: { type: String, required: false },
  slogan: { type: String, required: false },
  age: { type: Number, required: false },
  gender: { type: String, required: false },
  ethnicity: { type: String, required: false },
  nationality: { type: String, required: false },
  userId: { type: String },
  //Physical
  hairColor: { type: String, required: false },
  eyeColor: { type: String, required: false },
  height: { type: Number, required: false },
  weight: { type: Number, required: false },
  dressSize: { type: String, required: false },
  shoeSize: { type: String, required: false },
  bustWaistHips: { type: String, required: false },
  brest: { type: String, required: false },
  pubicHair: { type: String, required: false },
  //Additional
  about: { type: String, required: false },
  smoking: { type: Boolean, required: false },
  drinking: { type: Boolean, required: false },
  tattoos: { type: Boolean, required: false },
  piercings: { type: Boolean, required: false },
});

module.exports = mongoose.model("EscortProfile", EscortProfileSchema);
