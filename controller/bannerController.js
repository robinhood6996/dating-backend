const Banner = require("../models/banner.model");
const User = require("../models/user.model");
const cron = require('node-cron');
function calculateFutureDate(date, duration) {
  const millisecondsInDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day

  // Convert the date to milliseconds
  const dateInMilliseconds = date.getTime();

  // Calculate the future date by adding the duration (in days) to the given date
  const futureDateInMilliseconds =
    dateInMilliseconds + duration * millisecondsInDay;

  // Create a new Date object with the future date in milliseconds
  const futureDate = new Date(futureDateInMilliseconds);

  return futureDate;
}

exports.addBanner = async (req, res) => {
  try {
    const {
      position,
      country,
      city,
      url,
      startDate,
      endDate,
      duration,
      payAmount,
      name,
      username,
      email,
      paymentMedia,
      paymentStatus,
    } = req.body;

    //Check user existence
    // let userExist = await User.findOne({ email });
    // if (!userExist) {
    //   return res.send(401).json("Unauthorised");
    // }

    // Check if required fields are provided
    if (
      !position ||
      !country ||
      !city ||
      !duration ||
      !payAmount ||
      !username ||
      !email ||
      !startDate
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    console.log("files", req.files);
    // Check if position is a valid value
    // const validPositions = ["top", "left", "right"];
    // if (!validPositions.includes(position)) {
    //   return res.status(400).json({ message: "Invalid position" });
    // }

    // Check if duration is a positive number
    if (duration <= 0) {
      return res
        .status(400)
        .json({ message: "Duration must be a positive number" });
    }

    // Check if price is a positive number
    if (payAmount <= 0) {
      return res
        .status(400)
        .json({ message: "Price must be a positive number" });
    }

    // Create and save the new banner
    if (paymentMedia === "bank") {
      const files = req.files.find((file) => file.fieldname === "image");
      const receipt = req.files.find((file) => file.fieldname === "bank");
      const banner = new Banner({
        position,
        country,
        city,
        image: { filename: files.filename, path: files.path },
        duration,
        payAmount: parseInt(payAmount),
        paymentMedia,
        name,
        username,
        email,
        startDate,
        endDate,
        paymentStatus,
        isBank: true,
        paymentDetails: {
          receipt: {
            filename: receipt.filename,
            path: receipt.path,
          },
        },
        expired: false,
        active: false,
      });
      await banner.save();
      return res.status(201).json({ banner });
    } else {
      const files = req.files.find((file) => file.fieldname === "image");
      const banner = new Banner({
        position,
        country,
        city,
        image: { filename: files.filename, path: files.path },
        duration,
        payAmount: parseInt(payAmount),
        paymentMedia,
        name,
        username,
        email,
        isBank: false,
        paymentStatus,
        active: true,
        expired: false,
      });
      await banner.save();
      return res.status(201).json({ banner });
    }
  } catch (error) {
    console.error(error);

    // If the error is a Mongoose validation error, return the specific error message
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: errors.join(", ") });
    }

    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllBanners = async (req, res) => {
  try {
    const { paid, country, city } = req.params;

    let params = {};
    if (paid) {
      params.paid = paid;
    }
    if (country) {
      params.country = country;
    }
    if (city) {
      params.city = city;
    }

    const banners = await Banner.find(params);
    return res.json({ banners });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.editBanner = async (req, res) => {
  try {
    const bannerId = req.params.bannerId;
    const { isPaid, url } = req.body;

    if (!bannerId) {
      return res.status(400).json({ message: "Banner ID is required" });
    }

    if (!bannerData) {
      return res.status(400).json({ message: "Banner data is required" });
    }

    const existingBanner = await Banner.findById(bannerId);

    if (!existingBanner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    if (bannerData.user) {
      return res.status(400).json({ message: "User cannot be modified" });
    }

    const updatedBanner = await Banner.findByIdAndUpdate(bannerId, bannerData, {
      new: true,
    });

    res.json({ banner: updatedBanner });
  } catch (err) {
    console.error(err);
    if (err instanceof mongoose.Error.ValidationError) {
      const errorMessages = Object.values(err.errors).map(
        (error) => error.message
      );
      return res.status(400).json({ message: errorMessages });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteBanner = async (req, res) => {
  try {
    const { id } = req.query;
    const banner = await Banner.findOne({ _id: id });
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }
    console.log("banner", banner);
    // Check if user type is admin
    // if (req.user.type !== "admin") {
    //   return res.status(403).json({ message: "Not authorized" });
    // }

    await banner.deleteOne();
    res.json({ message: "Banner deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getMyBanners = async (req, res) => {
  try {
    const { email } = req.user;

    const banners = await Banner.find({ email });
    return res.status(200).json({ banners });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
exports.getPositionBanners = async (req, res) => {
  try {
    let query = { isPaid: true, active: true, expired: false }
    const { position } = req.query;
    if(position){
      query.position = position;
    }
    const banners = await Banner.find(query);
    return res.status(200).json({ banners });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


exports.holdBanner = async (req, res) => {
  const { bannerId, holdDays } = req.body;
  const { username } = req.user; // Assuming you have user authentication implemented and can retrieve the user ID

  try {
    // Check if the banner exists and belongs to the user
    const banner = await Banner.findOne({ _id: bannerId, username });
    if (banner.holdDays) {
      return res.status(400).json({ message: 'Cannot edit hold banner' });
    }
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    if (banner.expired) {
      return res.status(400).json({ message: 'Cannot edit expired banner' });
    }

    // Calculate the new start and end dates based on holdDays
    const currentDate = new Date();
    const forceStartDate = currentDate;
    const forceStopDate = new Date(currentDate.getTime() + holdDays * 60 * 1000); // * 24 * 60
    const endDate = new Date(banner.endDate.getTime() + holdDays * 60 * 1000);//24 * 60 *

    // Update the banner with the new dates and holdDays
    banner.forceStartDates = forceStartDate;
    banner.forceStopDates = forceStopDate;
    banner.holdDays = holdDays;
    banner.endDate = endDate;
    banner.active = false; // Set active to false until the hold period is over
    await banner.save();

    return res.status(200).json({ message: 'Banner successfully updated' });
  } catch (error) {
    console.error('Error editing banner:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}



// Schedule the cron job to run every hour
cron.schedule('*/1 * * * *', async () => {
  console.log('Banner crob triggered')
  try {
    // Find all held banners with forceStopDate less than today's date
    const heldBanners = await Banner.find({
      active: false,
      holdDays: { $ne: null },
      forceStopDates: { $lte: new Date() }
    });
    
    for (const banner of heldBanners) {
      // Update the banner to make it active and reset hold-related fields
      banner.active = true;
      banner.holdDays = 0;
      banner.forceStartDates = null;
      banner.forceStopDates = null;
      
      await banner.save();
    }
    
    console.log('Cron job executed successfully');
  } catch (error) {
    console.error('Error executing cron job:', error);
  }
});

