const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  profileImage: { type: String, default: null },
});

const RatingSchema = new Schema(
  {
    meetingData: { type: Date },
    meetingCity: { type: String, required: true },
    meetingPlace: { type: String, required: true },
    strikeLength: { type: String, required: true },
    appearanceRate: { type: Number, required: true },
    serviceRate: { type: Number, required: true },
    attitude: { type: String, required: true },
    chat: { type: String, required: true },
    performance: { type: String, required: true },
    details: { type: String, required: true },
    customerDetails: { type: UserSchema, required: true },
    escortDetails: { type: UserSchema, required: true },
    reply: { type: String, require: false, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rating", RatingSchema);
