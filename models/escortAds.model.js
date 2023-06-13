const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Schema
const escortAdSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String, required: true },
    packageType: { type: Number, required: true, enum: [1, 2, 3, 4] }, //1=
    duration: { type: Number, required: true },
    payAmount: { type: Number, required: true },
    isPaid: { type: Boolean, required: true, default: false },
    paymentMedia: { type: String, required: true, enum: ["card", "bank"] },
    paymentDetails: { type: Object, default: {} },
    isBank: { type: Boolean, default: false },
    memberShipDetails: { type: Object },
    country: { type: String, lowercase: true, default: null },
    city: { type: String, lowercase: true, default: null },
    startDate: { type: Date },
    endDate: { type: Date },
    status: { type: String, enum: ["pending", "active", "expired"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EscortAd", escortAdSchema);
