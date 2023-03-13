const mongoose = require("mongoose");
const { EscortProfileSchema } = require("../schema/escortSchema");

module.exports = mongoose.model("EscortProfile", EscortProfileSchema);
