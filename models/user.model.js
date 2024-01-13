const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Schema
const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String, enum: ["male", "female", "other"] },
    age: { type: Number, required: false },
    phone: { type: String, required: false },
    type: {
      type: String,
      required: true,
      enum: ["escort", "default", "admin"],
    },
    username: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
