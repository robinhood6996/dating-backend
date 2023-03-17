const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Schema
const EscortProfileSchema = new Schema({
  //Biography
  name: { type: String, required: true },
  email: {type: String, required: true},
  userId: {type: String, required: true},
  slogan: { type: String},
  age: { type: Number},
  gender: { type: String},
  ethnicity: { type: String},
  nationality: { type: String},
  userId: { type: String },
  //Physical
  hairColor: { type: String},
  eyeColor: { type: String},
  height: { type: Number},
  weight: { type: Number},
  dressSize: { type: String},
  shoeSize: { type: String},
  bustWaistHips: { type: String},
  brest: { type: String},
  pubicHair: { type: String},
  //Additional
  about: { type: String},
  smoking: { type: Boolean},
  drinking: { type: Boolean},
  tattoos: { type: Boolean},
  piercings: { type: Boolean},
});

module.exports = mongoose.model("EscortProfile", EscortProfileSchema);
