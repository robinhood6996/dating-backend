const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DefaultUserSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  profileImage: { type: Object },
  age: { type: String, required: true },
  gender: { type: String, required: true },
  username: { type: String, required: true },
  ethnicity: { type: String },
  nationality: { type: String },
  country: { type: String },
  city: { type: String },
});

module.exports = mongoose.model("DefaultUser", DefaultUserSchema);
