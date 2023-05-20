const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    position: {
      type: String,
      required: true,
      enum: ["profile", "right", "left"],
    },
    country: { type: String, required: true },
    city: { type: String, required: true },
    image: { type: [], required: true },
    duration: { type: Number, required: true },
    price: { type: Number, required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    paymentStatus: { type: Number, default: 0, enum: [1, 0] },
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
