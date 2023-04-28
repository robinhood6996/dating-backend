const mongoose = require("mongoose");

const blackListTokenSchema = new mongoose.Schema(
  {
    token: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("blackListToken", blackListTokenSchema);
