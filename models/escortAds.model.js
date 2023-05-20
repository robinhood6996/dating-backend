const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Schema
const escortAdSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  packageType: { type: String, required: true },
  duration: { type: Number, required: true },
  payAmount: { type: Number, required: true },
  isPaid: { type: Boolean, required: true, default: false },
  paymentMedia: { type: String, required: true, enum: ["card", "bank"] },
  paymentDetails: { type: Object, default: {} },
  isBank: { type: Boolean, default: false },
});

module.exports = mongoose.model("EscortAd", escortAdSchema);
