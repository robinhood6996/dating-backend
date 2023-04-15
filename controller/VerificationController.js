const { FreeAd } = require("../models/verification.model");
exports.createAd = async (req, res) => {
  try {
    const { userId } = req.params;
    const { photo1, photo2, photo3, extraPhotos, userEmail, status } = req.body;
    // Check if request body exists
    if (!req.body) {
      return res.status(400).json({ message: "Request body is required" });
    }

    // Check if required fields exist in request body
    const requiredFields = [
      "photo1",
      "photo2",
      "description",
      "photo3",
      "userEmail",
    ];
    const missingFields = requiredFields.filter(
      (field) => !(field in req.body)
    );
    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }
    if (userEmail) {
      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email address" });
      }
    }

    // Create new free ad document
    const verification = new FreeAd({
      title,
      category,
      city: req.body.city || "",
      description,
      phone,
      email: email || "",
      duration: req.body.duration || 15,
      photo1,
      photo2: req.body.photo2 || "",
      photo3: req.body.photo3 || "",
      status: req.body.status || "inactive",
    });

    // Save new free ad document
    const savedFreeAd = await freeAd.save();

    res.status(201).json({ freeAd: savedFreeAd, message: "Free ad added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
