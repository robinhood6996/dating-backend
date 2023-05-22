const Rating = require("../models/rating.model"); // Assuming you have a Rating model defined

exports.addRating = async (req, res) => {
  const {
    meetingCity,
    meetingPlace,
    strikeLength,
    appearanceRate,
    serviceRate,
    attitude,
    chat,
    performance,
    details,
  } = req.body;
  const { username: customerUsername, email: customerEmail } = req.user; // Assuming customer's username and email are available in req.user
  const { username: escortUsername, email: escortEmail } = req.body; // Assuming escort's username and email are available in req.body

  try {
    const newRating = new Rating({
      meetingCity,
      meetingPlace,
      strikeLength,
      appearanceRate,
      serviceRate,
      attitude,
      chat,
      performance,
      details,
      customerDetails: { username: customerUsername, email: customerEmail },
      escortDetails: { username: escortUsername, email: escortEmail },
    });

    const savedRating = await newRating.save();
    res.json(savedRating);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllRatings = async (req, res) => {
  const { city, appearanceRate, serviceRate, attitude, chat, performance } =
    req.query;

  const filter = {};

  if (city) {
    filter.meetingCity = city;
  }

  if (appearanceRate) {
    filter.appearanceRate = appearanceRate;
  }

  if (serviceRate) {
    filter.serviceRate = serviceRate;
  }

  if (attitude) {
    filter.attitude = attitude;
  }

  if (chat) {
    filter.chat = chat;
  }

  if (performance) {
    filter.performance = performance;
  }

  try {
    const ratings = await Rating.find(filter);
    res.status(200).json({ data: ratings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getRatingsByUsernames = async (req, res) => {
  const { customerUsername, escortUsername } = req.query;

  const filter = {};

  if (customerUsername) {
    filter["customerDetails.username"] = customerUsername;
  }

  if (escortUsername) {
    filter["escortDetails.username"] = escortUsername;
  }

  try {
    const ratings = await Rating.find(filter);
    res.json(ratings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
