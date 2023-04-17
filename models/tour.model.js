const mongoose = require("mongoose");


const cityTourSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dateFrom: { type: Date, required: true },
  dateTo: { type: Date, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  city: { type: String, required: true },
  status: { type: String, default: "pending" },
  user: { type: String, required: true },
});

module.exports = mongoose.model("CityTour", cityTourSchema);
