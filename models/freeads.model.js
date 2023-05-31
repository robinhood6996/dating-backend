const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const freeAdSchema = new Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    city: { type: String },
    description: { type: String, required: true },
    phone: { type: Number, required: true },
    email: { type: String },
    username: { type: String },
    duration: { type: Number },
    photos: { type: Array, required: true },
    ownerEmail: { type: String, required: true },
  },
  { timestamps: true }
);

freeAdSchema.methods = {
  findActive: function () {
    return mongoose.model("FreeAd").find({ status: "active" });
  },
  findInactive: function () {
    return mongoose.model("FreeAd").find({ status: "inactive" });
  },
  findAll: function () {
    return mongoose.model("FreeAd").find({});
  },
};
freeAdSchema.statics.deleteById = function (_id) {
  return this.deleteOne({ _id: _id });
};

const FreeAd = new mongoose.model("FreeAd", freeAdSchema);
module.exports = { FreeAd };
