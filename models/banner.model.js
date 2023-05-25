const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String, required: true },
    position: {
      type: String,
      required: true,
      enum: ["profile", "right", "left"],
    },
    country: { type: String, required: true },
    city: { type: String, required: true },
    image: { type: [], required: true },
    duration: { type: Number, required: true },
    payAmount: { type: Number, required: true },
    paymentDetails: { type: Object, default: {} },
    isPaid: { type: Boolean, default: false },
    isBank: { type: Boolean, default: false },
  },
  { timestamps: true }
);

bannerSchema.methods = {
  findPaid: function () {
    return mongoose.model("Banner").find({ paymentStatus: "paid" });
  },
  findUnpaid: function () {
    return mongoose.model("Banner").find({ paymentStatus: "unpaid" });
  },
  findByEmail: function (email) {
    return mongoose.model("Banner").find({ user: email });
  },
  findAll: function () {
    return mongoose.model("Banner").find({});
  },
};

module.exports = mongoose.model("Banner", bannerSchema);
