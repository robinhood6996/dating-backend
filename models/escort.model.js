const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schema
const EscortProfileSchema = new Schema(
  {
    // Biography
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    slogan: { type: String },
    age: { type: Number },
    gender: { type: String, lowercase: true },
    ethnicity: { type: String, lowercase: true },
    nationality: { type: String, lowercase: true },
    country: { type: String, lowercase: true },
    state: { type: String, lowercase: true },
    userName: { type: String },

    // Physical
    hairColor: { type: String, lowercase: true },
    eyeColor: { type: String, lowercase: true },
    height: { type: String, lowercase: true },
    weight: { type: String, lowercase: true },
    dressSize: { type: String, lowercase: true },
    shoeSize: { type: String, lowercase: true },
    bustWaistHips: { type: String, lowercase: true },
    brest: { type: String, lowercase: true },
    pubicHair: { type: String, lowercase: true },

    // Additional
    about: { type: String, lowercase: true },
    smoking: { type: Boolean },
    drinking: { type: Boolean },
    tattoos: { type: Boolean },
    piercings: { type: Boolean },

    // Contact
    phone: { type: String },
    phoneDirection: { type: String, lowercase: true },
    apps: { type: String, lowercase: true },
    website: { type: String, lowercase: true },
    email: { type: String, lowercase: true },
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
    orientation: { type: String, default: "", lowercase: true },
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
    workingCities: {
      secondCity: { type: String, default: null, lowercase: true },
      thirdCity: { type: String, default: null, lowercase: true },
      fourthCity: { type: String, default: null, lowercase: true },
      selectedTimezone: { type: String, default: null, lowercase: true },
    },
    inCall: { type: String, default: "" },
    outCall: { type: String, default: "" },
    // Gallery
    images: { type: Array, default: [] },
    realPics: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
    pornStar: { type: Boolean, default: false },
    withVideo: { type: Boolean, default: false },
  },
  { timestamps: true }
);

EscortProfileSchema.statics.findByEmail = async function (email) {
  try {
    const profile = await this.findOne({ email }); // Find the profile using the email
    return profile; // Return the profile object if found, or null if not found
  } catch (error) {
    return error;
  }
};
EscortProfileSchema.static.findByCategory = function (category) {
  try {
    return this.findOne({ gender: category }); // Find the profile using the category
    // Return the profile object if found, or null if not found
  } catch (error) {
    return error;
  }
};
const EscortProfile = new mongoose.model("EscortProfile", EscortProfileSchema);
module.exports = { EscortProfile };
