const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const defaultUserSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  age: { type: String, required: true },
  gender: { type: String, required: true },
  username: { type: String, required: true },
  ethnicity: { type: String },
  nationality: { type: String },
  country: { type: String },
  city: { type: String },
});

const defaultUser = new mongoose.model("DefaultUser", defaultUserSchema);
module.exports = { defaultUser };
