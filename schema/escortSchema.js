const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Schema
const EscortProfileSchema = new Schema({
  //Biography
  name: { type: String, required: true },
  slogan: { type: String, required: false },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  ethnicity: { type: String, required: false },
  nationality: { type: String, required: false },
  //Physical
  hairColor: { type: String, required: true },
  eyeColor: { type: String, required: true },
  height: { type: Number, required: false },
  weight: { type: Number, required: false },
  dressSize: { type: String, required: false },
  shoeSize: { type: String, required: false },
  bustWaistHips: { type: String, required: false },
  brest: { type: String, required: false },
  pubicHair: { type: String, required: false },
  //Additional
  about: { type: String, required: true },
  smoking: { type: Boolean, required: false },
  drinking: { type: Boolean, required: false },
  tattoos: { type: Boolean, required: false },
  piercings: { type: Boolean, required: false },
});

module.exports = { EscortProfileSchema };
