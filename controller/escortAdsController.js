const EscortAd = require("../models/escortAds.model"); // Assuming you have the EscortAd model defined
const { EscortProfile } = require("../models/escort.model");
const cron = require("node-cron");

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
    startDate,
    endDate,
    paymentMedia,
    paymentDetails,
    isBank,
    country,
    city,
  } = req.body;

  try {
    if (paymentMedia === "bank") {
      const receipt = req.files.find((file) => file.fieldname === "bank");
      console.log("files", req.files);
      const newEscortAd = new EscortAd({
        name,
        email,
        username,
        packageType,
        duration,
        payAmount,
        startDate,
        endDate,
        paymentMedia,
        paymentDetails: {
          receipt: {
            filename: receipt.filename,
            path: receipt.path,
          },
        },
        isBank,
        country,
        city,
      });
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
    } else {
      const newEscortAd = new EscortAd({
        name,
        email,
        username,
        packageType,
        duration,
        startDate,
        endDate,
        payAmount,
        paymentMedia,
        paymentDetails,
        isBank,
        country,
        city,
      });
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
    }

    // Validate the schema
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getFeaturedEscorts = async (req, res) => {
  try {
    // Find all escortAds with packageType 2 or 4
    const escortAds = await EscortAd.find({
      packageType: { $in: [2, 4, 1] },
      expired: false,
      isPaid: true,
      active: true,
    });
    // Extract emails from escortAds into an array
    const emails = escortAds.map((ad) => ad.email);

    // Find EscortProfiles matching the extracted emails
    const escortProfiles = await EscortProfile.find({
      email: { $in: emails },
    });

    //Return the found EscortProfiles
    res.json(escortProfiles);
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getGirlofTheMonth = async (req, res) => {
  try {
    // Find all escortAds with packageType 2 or 4
    const escortAds = await EscortAd.find({
      packageType: { $in: [3] },
      expired: false,
      isPaid: true,
      active: true,
    });

    // Extract emails from escortAds into an array
    const emails = escortAds.map((ad) => ad.email);

    // Find EscortProfiles matching the extracted emails
    const escortProfiles = await EscortProfile.find({
      email: { $in: emails },
    });

    //Return the found EscortProfiles
    res.json(escortProfiles);
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({ error: "Internal server error" });
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
    return res.status(403).json("You are not allowed 88");
  }
};

//Hold banner for days
exports.holdAds = async (req, res) => {
  const { adId, holdDays } = req.body;
  const { username } = req.user; // Assuming you have user authentication implemented and can retrieve the user ID

  try {
    // Check if the banner exists and belongs to the user
    const escortAd = await EscortAd.findOne({ _id: adId, username });
    if (escortAd.holdDays) {
      return res.status(400).json({ message: "Cannot edit hold Ad" });
    }
    if (!escortAd) {
      return res.status(404).json({ message: "Ad not found" });
    }

    if (escortAd.expired) {
      return res.status(400).json({ message: "Cannot edit expired ads" });
    }
    if (!escortAd.active) {
      return res.status(400).json({ message: "Cannot edit pending ads" });
    }

    // Calculate the new start and end dates based on holdDays
    const currentDate = new Date();
    const forceStartDate = currentDate;
    const forceStopDate = new Date(
      currentDate.getTime() + holdDays * 60 * 1000
    ); // * 24 * 60
    const endDate = new Date(escortAd.endDate.getTime() + holdDays * 60 * 1000); //24 * 60 *

    // Update the banner with the new dates and holdDays
    escortAd.forceStartDates = forceStartDate;
    escortAd.forceStopDates = forceStopDate;
    escortAd.holdDays = holdDays;
    escortAd.endDate = endDate;
    escortAd.active = false; // Set active to false until the hold period is over
    await escortAd.save();

    return res
      .status(200)
      .json({ message: "Advertisement successfully updated" });
  } catch (error) {
    console.error("Error editing Ad data:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Schedule the cron job to run every hour
cron.schedule("*/1 * * * *", async () => {
  console.log("Ad cron triggered");
  try {
    // Find all held banners with forceStopDate less than today's date
    const holdAds = await EscortAd.find({
      active: false,
      holdDays: { $ne: null },
      forceStopDates: { $lte: new Date() },
    });

    for (const ad of holdAds) {
      // Update the banner to make it active and reset hold-related fields
      ad.active = true;
      ad.holdDays = 0;
      ad.forceStartDates = null;
      ad.forceStopDates = null;

      await ad.save();
    }

    const expiredAds = await EscortAd.find({
      active: true,
      $or: [{ holdDays: null }, { holdDays: 0 }],
      forceStartDates: null,
      forceStopDates: null,
      endDate: { $lt: today },
    });

    for (const ad of expiredAds) {
      // Update the banner to make it active and reset hold-related fields
      ad.active = false;
      ad.expired = true;
      await ad.save();
    }
  } catch (error) {
    // console.error("Error executing cron job:", error);
  }
});
