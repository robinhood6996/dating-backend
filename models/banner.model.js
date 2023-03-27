const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  position: { type: String, required: true },
  country: { type: String, required: true},
  city: { type: String, required: true},
  image: { type: String, required: true },
  duration: { type: Number, required: true },
  price: { type: Number, required: true },
  paymentStatus: { type: String },
  transactionId: { type: String }
});

module.exports = mongoose.model('Banner', bannerSchema);
