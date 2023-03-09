const { EscortBiography, PersonalDetails } = require("../models/escort.model");

exports.updateEscortBiography = async (req, res) => {
  try {
    if (req.body) {
      res.status(200).json({ data: req.body });
    }
  } catch (err) {
    res.status(200).json({ error: "Internal server error" });
  }
};
