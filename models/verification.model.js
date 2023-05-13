const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VerificationSchema = new Schema({
  name: { type: String, required: true },
  photos: { type: [], required: true, default: [] },
  username: { type: String, required: true },
  userEmail: { type: String, required: true },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "approved", "rejected"],
  },
});

VerificationSchema.methods = {
  findApproved: function () {
    return mongoose.model("verification").find({ approved: "approved" });
  },
  findPending: function () {
    return mongoose.model("verification").find({ approved: "pending" });
  },
  findRejected: function () {
    return mongoose.model("verification").find({ approved: "rejected" });
  },
  findAll: function () {
    return mongoose.model("verification").find({});
  },
};

const verification = new mongoose.model("verification", VerificationSchema);
module.exports = { verification };
