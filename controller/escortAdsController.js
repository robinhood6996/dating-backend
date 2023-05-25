const EscortAd = require("../models/escortAds.model"); // Assuming you have the EscortAd model defined

exports.addEscortAd = async (req, res) => {
  const { username, email, name } = req.user; // Assuming userName and email are available in req.user
  const {
    packageType,
    duration,
    payAmount,
    isPaid,
    paymentMedia,
    paymentDetails,
    isBank,
    country,
    city,
  } = req.body;

  try {
    const newEscortAd = new EscortAd({
      name,
      email,
      username: userName,
      packageType,
      duration,
      payAmount,
      paymentMedia,
      paymentDetails,
      isBank,
      country,
      city,
    });
    // Validate the schema
    const validationError = newEscortAd.validateSync();
    if (validationError) {
      const errors = validationError.errors;
      const errorMessages = Object.keys(errors).map(
        (key) => errors[key].message
      );
      return res
        .status(400)
        .json({ message: "Validation error", errors: errorMessages });
    }
    const savedEscortAd = await newEscortAd.save();
    res.json(savedEscortAd);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
