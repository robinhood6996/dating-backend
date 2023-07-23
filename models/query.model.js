const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuerySchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: Number, default: 0 },
    type: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Query", QuerySchema);
