const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Schema
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, enum: ["male", "female", "other"] },
  age: { type: Number },
  type: { type: String, required: true, enum: ["escort", "default", "admin"] },
  username: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);
