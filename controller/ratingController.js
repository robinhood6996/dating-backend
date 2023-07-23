const { EscortProfile } = require("../models/escort.model");
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
  const {
    type,
    username: customerUsername,
    email: customerEmail,
    name: customerName,
  } = req.user; // Assuming customer's username and email are available in req.user
  const { username: escortUsername, email: escortEmail } = req.body; // Assuming escort's username and email are available in req.body

  try {
    if (type !== "default") {
      return res.status(403).json({ message: "You cant give review." });
    }
    let escort = await EscortProfile.findOne({ userName: escortUsername });
    if (!escort) {
      return res.status(404).json({ message: "Escort not found" });
    }
    let name = escort?.name;
    let profileImage = escort.profileImage;

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
      customerDetails: {
        username: customerUsername,
        email: customerEmail,
        name: customerName,
      },
      escortDetails: {
        username: escortUsername,
        email: escortEmail,
        name,
        profileImage,
      },
    });

    const savedRating = await newRating.save();
    res.json(savedRating);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllRatings = async (req, res) => {
  const {
    city,
    appearanceRate,
    serviceRate,
    attitude,
    chat,
    performance,
    limit,
    offset,
    search,
  } = req.query;

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
  if (search) {
    filter.$or = [
      { "customerDetails.name": { $regex: search, $options: "i" } },
      { "escortDetails.name": { $regex: search, $options: "i" } },
    ];
  }
  try {
    const ratings = await Rating.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));
    res.status(200).json({ data: ratings, count: ratings.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getRatingsByUsernames = async (req, res) => {
  const { customerUsername, escortUsername } = req.query;

  console.log("filter");
  let filter = {};
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

exports.getSingleRatings = async (req, res) => {
  const { ratingId } = req.params;

  try {
    const rating = await Rating.findOne({ _id: ratingId });
    res.status(200).json({ rating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.deleteReviews = async (req, res) => {
  const { ratingId } = req.params;
  const user = req.user;
  try {
    const rating = await Rating.findOne({ _id: ratingId });
    if (user.type === "admin" && rating) {
      await Rating.deleteOne({ _id: ratingId });
      res.status(200).json({ message: "Deleted rating" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addReply = async (req, res) => {
  const { ratingId, reply } = req.body;
  const { email } = req.user; // Assuming you have user authentication implemented and can retrieve the escort ID

  try {
    // Check if the rating exists and belongs to the escort
    const rating = await Rating.findOne({
      _id: ratingId,
      "escortDetails.email": email,
    });

    if (!rating) {
      return res.status(404).json({ message: "Rating not found" });
    }

    // Update the rating with the reply
    rating.reply = reply;

    await rating.save();

    return res.status(200).json({ message: "Reply added successfully" });
  } catch (error) {
    console.error("Error adding reply:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
