const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Schema
const EscortProfileSchema = new Schema({
  //Biography
  name: { type: String, required: true },
  email: { type: String, required: true },
  userId: { type: String, required: true },
  slogan: { type: String },
  age: { type: Number },
  gender: { type: String },
  ethnicity: { type: String },
  nationality: { type: String },
  userId: { type: String },
  //Physical
  hairColor: { type: String },
  eyeColor: { type: String },
  height: { type: Number },
  weight: { type: Number },
  dressSize: { type: String },
  shoeSize: { type: String },
  bustWaistHips: { type: String },
  brest: { type: String },
  pubicHair: { type: String },
  //Additional
  about: { type: String },
  smoking: { type: Boolean },
  drinking: { type: Boolean },
  tattoos: { type: Boolean },
  piercings: { type: Boolean },

  //contact
  phone: { type: String },
  phoneDirection: { type: String },
  apps: { type: String },
  email: { type: String },
  website: { type: String },

  //lang
  languages: { type: Array, default: [] },

  //availability
  available24: { type: Boolean, default: true },
  availableDate: { type: [], default: [] },
  vacation: { type: Object, default: { from: null, to: null } },

  //Incoming
  incomingCall: { type: String, default: null },
  outgoingCall: { type: String, default: null },

  //service
  services: { type: [], default: [] },

  //Rate:
  reachHome: {
    type: Object,
    default: {
      hour: null,
      threeHour: null,
      additionHour: null,
      night: null,
      dinner: null,
      weekend: null,
    },
  },
  host: {
    type: Object,
    default: {
      hour: null,
      threeHour: null,
      additionHour: null,
      night: null,
      dinner: null,
      weekend: null,
    },
  },

  //Gallery
  images: { type: Array, default: [] },
});

module.exports = mongoose.model("EscortProfile", EscortProfileSchema);
