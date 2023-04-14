const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VerificationSchema = new Schema({
  photo1: { type: String, required: true },
  photo2: { type: String, required: true },
  photo3: { type: String, required: true },
  extraPhotos: { type: [], default: [] },
  status: { type: String, default: "pending" },
  userId: { type: String, required: true },
  userEmail: { type: String, required: true },
});

freeAdSchema.methods = {
  findApproved: function () {
    return mongoose.model("verification").find({ approved: "approved" });
  },
  findPending: function () {
    return mongoose.model("FreeAd").find({ approved: "pending" });
  },
  findRejected: function () {
    return mongoose.model("FreeAd").find({ approved: "rejected" });
  },
  findAll: function () {
    return mongoose.model("FreeAd").find({});
  },
};

const verification = new mongoose.model("verification", VerificationSchema);
module.exports = { verification };
