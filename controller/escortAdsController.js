const EscortAd = require("../models/escortAds.model"); // Assuming you have the EscortAd model defined
const { EscortProfile } = require("../models/escort.model");
function getFutureDate(numberOfDays) {
  // Create a new Date object for the current date
  let currentDate = new Date();

  // Calculate the future date by adding the specified number of days
  let futureDate = new Date();
  futureDate.setDate(currentDate.getDate() + numberOfDays);

  // Return the future date
  return futureDate;
}
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
      status: "active",
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
      memberShip: { $in: [2, 4] },
      "memberShipDetails.endDate": { $gte: currentDate },
    });

    res.status(200).json({ escorts });
  } catch (error) {
    console.error("Error retrieving escorts:", error);
    res.status(500).json({ error: "Failed to retrieve escorts" });
  }
};

exports.getGirlofTheMonth = async (req, res) => {
  try {
    const currentDate = new Date();

    const escorts = await EscortProfile.find({
      memberShip: { $in: [3] },
      "memberShipDetails.endDate": { $gte: currentDate },
    });

    res.status(200).json({ escorts });
  } catch (error) {
    console.error("Error retrieving escorts:", error);
    res.status(500).json({ error: "Failed to retrieve escorts" });
  }
};

exports.getAllEscortsAd = async (req, res) => {
  const { isPaid, expired, limit, offset } = req.query;

  if (expired === undefined) {
    const query = {};
    if (isPaid !== undefined) {
      query.isPaid = isPaid;
    }

    try {
      const ads = await EscortAd.find({ ...query })
        .limit(limit)
        .skip(offset);
      res.status(200).json({ ads });
    } catch (error) {
      console.error("Error updating isPaid status:", error);
      res.status(500).json({ error: "Failed to update isPaid status" });
    }
  } else {
    const today = new Date();

    const ads = await EscortAd.aggregate([
      {
        $addFields: {
          expirationDate: {
            $add: ["$createdAt", { $multiply: ["$duration", 1000] }], // Assuming duration is in seconds
          },
        },
      },
      {
        $match: {
          expirationDate: { $lt: today },
        },
      },
    ]);

    res.status(200).json({ ads });
  }
};
exports.getMyAds = async (req, res) => {
  const { username } = req.user;

  try {
    const ads = await EscortAd.find({ username });
    res.status(200).json({ ads });
  } catch (error) {
    console.error("Error updating isPaid status:", error);
    res.status(500).json({ error: "Failed to update isPaid status" });
  }
};
exports.updateIsPaidStatus = async (req, res) => {
  const { type } = req.user;
  const { adId } = req.params;
  const { isPaid, media } = req.body;

  if (type === "admin") {
    try {
      const updatedAd = await EscortAd.findByIdAndUpdate(
        adId,
        { $set: { isPaid, paymentMedia: media } },
        { new: true }
      );

      if (!updatedAd) {
        return res.status(404).json({ error: "Escort ad not found" });
      }

      const { username, packageType, duration, paymentMedia } = updatedAd;

      const updatedProfile = await EscortProfile.findOneAndUpdate(
        { username },
        {
          $set: {
            memberShip: packageType,
            memberShipDetails: {
              startDate: new Date(),
              endDate: getFutureDate(duration),
              paymentMedia,
            },
          },
        },
        { new: true }
      );

      if (!updatedProfile) {
        return res.status(404).json({ error: "Escort profile not found" });
      }

      res.status(200).json({ message: "Payment status updated" });
    } catch (error) {
      console.error("Error updating isPaid status:", error);
      res.status(500).json({ error: "Failed to update isPaid status" });
    }
  } else {
    return res.status(403).json("You are not allowed");
  }
};
