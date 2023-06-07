const Banner = require("../models/banner.model");
const User = require("../models/user.model");


function calculateFutureDate(date, duration) {
  const millisecondsInDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day

  // Convert the date to milliseconds
  const dateInMilliseconds = date.getTime();

  // Calculate the future date by adding the duration (in days) to the given date
  const futureDateInMilliseconds = dateInMilliseconds + (duration * millisecondsInDay);

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
    const files = req.files.find(file => file.fieldname === 'image');
    const receipt = req.files.find(file => file.fieldname === 'bank');
    console.log('receipt', req.files)
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
    if (paymentMedia === 'bank') {
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
        paymentDetails: {
          receipt: {
            filename: receipt.filename,
            path: files.path
          }
        }
      });
      await banner.save();
      return res.status(201).json({ banner });
    } else {
      const banner = new Banner({
        position,
        country,
        city,
        image: { filename: files[0].filename, path: files[0].path },
        duration,
        payAmount: parseInt(payAmount),
        paymentMedia,
        name,
        username,
        email,
        paymentStatus,
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
    const { isPaid, url,  } = req.body;

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
    const bannerId = req.params.id;
    const banner = await Banner.findById(bannerId);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    // Check if user type is admin
    // if (req.user.type !== "admin") {
    //   return res.status(403).json({ message: "Not authorized" });
    // }

    await banner.delete();
    res.json({ message: "Banner deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.getMyBanners = async (req, res) => {
  try {
    const {email} = req.user;

    const banners = await Banner.find({email});
    return res.status(200).json({ banners });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
exports.getPositionBanners = async (req, res) => {
  try {
    const {position} = req.query;
    const banners = await Banner.find({position, isPaid: true});
    return res.status(200).json({ banners });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};