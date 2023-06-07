const { EscortProfile } = require("../models/escort.model");
const CityTour = require("../models/tour.model");
const User = require("../models/user.model");

exports.getAllCityTours = async (req, res) => {
  try {
    const cityTours = await CityTour.find();
    res.json({ cityTours });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.createCityTour = async (req, res) => {
  try {
    const { email: userEmail, username } = req.user;
    const { name, dateFrom, dateTo, email, phone, city } = req.body;
    let escort = await EscortProfile.findOne({ email: userEmail });
    // Check if all required fields are present in the request body
    if (!name || !dateFrom || !dateTo || !email || !phone || !city) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate email address
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }
    const cityTour = new CityTour({
      name,
      dateFrom,
      dateTo,
      email,
      phone,
      city,
      username,
      status: "pending",
      profileImage: escort?.profileImage,
      escortEmail: userEmail,
    });

    await cityTour.save();

    return res.status(201).json({ cityTour, message: "City tour created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteCityTour = async (req, res) => {
  try {
    const { email } = req.user;
    const { id } = req.query;
    const user = await User.findOne({ email });

    const cityTour = await CityTour.findOne({ _id: id });
    if (cityTour) {
      let hasAccess = cityTour.escortEmail === email;
      if (hasAccess || user.type === "admin") {
        await cityTour.deleteOne({ _id: id });
        return res
          .status(200)
          .json({ message: "Deleted successfully", statusCode: 200 });
      } else {
        res
          .status(403)
          .json({ message: "Forbidden this request", statusCode: 403 });
      }
    }
    res
      .status(404)
      .json({ message: "Not found city tour data", statusCode: 404 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getUserCityTour = async (req, res) => {
  const { email } = req.user;
  try {
    const cityTours = await CityTour.find({ escortEmail: email });
    res.json({ cityTours });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
