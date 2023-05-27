const EscortAd = require("../models/escortAds.model"); // Assuming you have the EscortAd model defined
const { EscortProfile } = require("../models/escort.model");

exports.addEscortAd = async (req, res) => {
  const { username, email, name } = req.user; // Assuming userName and email are available in req.user
  const {
    packageType,
    duration,
    payAmount,
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
      username,
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

exports.getFeaturedEscorts = async (req, res) => {
  try {
    const currentDate = new Date();

    const escorts = await EscortProfile.find({
      memberShip: 2,
      "memberShipDetails.endDate": { $gte: currentDate },
    });

    res.status(200).json({ escorts });
  } catch (error) {
    console.error("Error retrieving escorts:", error);
    res.status(500).json({ error: "Failed to retrieve escorts" });
  }
};
