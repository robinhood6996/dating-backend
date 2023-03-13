const EscortProfile = require("../models/escort.model");
const { EscortProfileSchema } = require("../schema/escortSchema");

exports.updateEscortBiography = async (req, res) => {
  try {
    if (req.body) {
      let body = req.body;
      let error;
      Object.entries(body).forEach(([key, type]) => {
        // console.log("key", key, EscortProfileSchema.tree.hasOwnProperty(key));
        if (EscortProfileSchema.tree.hasOwnProperty(key)) {
          error = null;
        } else {
          error = key;
        }
      });
      if (error) {
        res.status(400).json(`Unknown field "${error}"`);
      } else {
        let escort = new EscortProfile({
          ...body,
        });
        await escort.save(body).then(() => {
          res.status(200).json({ data: req.body });
        });
      }
    }
  } catch (err) {
    res.status(200).json({ error: "Internal server error" });
  }
};
