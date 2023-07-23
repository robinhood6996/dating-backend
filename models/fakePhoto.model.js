const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FakePhotoSchema = new Schema(
  {
    name: { type: String, required: true, lowercase: true },
    email: { type: String, required: true, lowercase: true },
    username: { type: String, required: true, lowercase: true },
    reporterName: { type: String, required: true, lowercase: true },
    reporterEmail: { type: String, required: true, lowercase: true },
    reporterUsername: { type: String, required: true, lowercase: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FakePhoto", FakePhotoSchema);
