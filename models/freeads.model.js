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
    duration: { type: Number },
    photo1: { type: String, required: true },
    photo2: { type: String },
    photo3: { type: String },
    status: { type: String },
    author: { type: String },
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
