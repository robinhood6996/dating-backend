const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schema
const EscortProfileSchema = new Schema({
  // Biography
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  slogan: { type: String },
  age: { type: Number },
  gender: { type: String },
  ethnicity: { type: String },
  nationality: { type: String },
  userName: { type: String },

  // Physical
  hairColor: { type: String },
  eyeColor: { type: String },
  height: { type: Number },
  weight: { type: Number },
  dressSize: { type: String },
  shoeSize: { type: String },
  bustWaistHips: { type: String },
  brest: { type: String },
  pubicHair: { type: String },

  // Additional
  about: { type: String },
  smoking: { type: Boolean },
  drinking: { type: Boolean },
  tattoos: { type: Boolean },
  piercings: { type: Boolean },

  // Contact
  phone: { type: String },
  phoneDirection: { type: String },
  apps: { type: String },
  website: { type: String },
  email: { type: String },
  // Languages
  languages: { type: Array, default: [] },

  // Availability
  available24: { type: Boolean, default: true },
  availableDate: { type: Array, default: [] },
  vacation: {
    from: { type: Date, default: null },
    to: { type: Date, default: null },
  },

  // Incoming
  incomingCall: { type: String, default: null },
  outgoingCall: { type: String, default: null },

  // Services
  services: { type: Array, default: [] },

  // Rates
  reachHome: {
    hour: { type: Number, default: null },
    threeHour: { type: Number, default: null },
    additionHour: { type: Number, default: null },
    night: { type: Number, default: null },
    dinner: { type: Number, default: null },
    weekend: { type: Number, default: null },
  },
  host: {
    hour: { type: Number, default: null },
    threeHour: { type: Number, default: null },
    additionHour: { type: Number, default: null },
    night: { type: Number, default: null },
    dinner: { type: Number, default: null },
    weekend: { type: Number, default: null },
  },

  // Gallery
  images: { type: Array, default: [] },
});

EscortProfileSchema.statics.findByEmail = async function (email) {
  try {
    const profile = await this.findOne({ email }); // Find the profile using the email
    return profile; // Return the profile object if found, or null if not found
  } catch (error) {
    return error;
  }
};
const EscortProfile = new mongoose.model("EscortProfile", EscortProfileSchema);
module.exports = { EscortProfile };
