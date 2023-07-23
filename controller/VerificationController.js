const { EscortProfile } = require("../models/escort.model");
const { verification } = require("../models/verification.model");
const fs = require("fs");

exports.verificationRequest = async (req, res) => {
  try {
    let user = req.user;
    if (req.files) {
      let files = req.files;
      console.log("req.files", req.files);
      let escort = await EscortProfile.findOne({ email: user.email });
      if (!escort) {
        return res.status(403).json({ message: "Not allowed" });
      }

      if (files.length < 3) {
        return res.status(400).json({ message: "Photos are required" });
      }

      const verify = new verification({
        name: escort.name,
        userEmail: user.email,
        username: user.username,
        photos: files,
        status: "pending",
      });

      await verify.save();
      return res.status(200).json({
        message: "Verification request sent",
        statusCode: 200,
      });
    }
    return res.status(400).json({ message: "Images are required" });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ message: "Error", error, statusCode: 500 });
  }
};

exports.verificationApprove = async (req, res) => {
  try {
    let user = req.user;
    if (user.type === "admin") {
      if (req.query) {
        let { id, status } = req.body;
        let verificationReq = await verification.findOne({ _id: id });
        verificationReq.status = status;
        let escort = await EscortProfile.findOne({
          email: verificationReq.userEmail,
        });
        if (escort) {
          escort.verified = status === "approved" ? true : false;
          await verificationReq.save();
          await escort.save();
        } else {
          return res.status(404).json({
            message: "Not found escort",
            statusCode: 404,
          });
        }
        return res.status(200).json({
          message: "Verification approved",
          statusCode: 200,
        });
      } else {
        return res.status(400).json({
          message: "verification id is required",
          statusCode: 400,
        });
      }
    }
    return res.status(403).json({
      message: "Sorry you are not allowed to do this action",
      statusCode: 403,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error", error, statusCode: 500 });
  }
};

exports.getVerificationItems = async (req, res) => {
  const { status, limit, offset, search } = req.query;
  const { type } = req.user;

  try {
    let query = {};
    if (status) {
      query.status = status;
    }

    // Apply search functionality if the "search" query parameter is provided
    if (search) {
      const searchRegex = new RegExp(search, "i"); // Case-insensitive search regex
      query.$or = [
        { name: searchRegex },
        { username: searchRegex },
        { userEmail: searchRegex },
        // Add more fields as needed for searching
      ];
    }

    // Handle pagination using "limit" and "offset" query parameters
    let limitValue = parseInt(limit) || 10; // Default limit is 10 if not provided or not a valid number
    let offsetValue = parseInt(offset) || 0; // Default offset is 0 if not provided or not a valid number

    const verificationItems = await verification
      .find(query)
      .limit(limitValue)
      .skip(offsetValue)
      .exec();

    if (type === "admin") {
      res.status(200).json(verificationItems);
    } else {
      res.status(403).json({ message: "You are not allowed" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getSingleUserVerifications = async (req, res) => {
  const { username } = req.params;

  try {
    const verificationItems = await verification.find({ username });
    res.status(200).json(verificationItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.deleteVerification = async (req, res) => {
  const { id } = req.query;
  const { type, email } = req.user;
  try {
    const verificationItems = await verification.findOne({ _id: id });
    console.log("verification", verificationItems);
    if (type === "admin" || verificationItems.userEmail === email) {
      const directoryPath = __dirname + "/../uploads/escort/";
      verificationItems?.photos?.forEach((photo) => {
        let file = photo?.filename;
        if (file) {
          fs.unlinkSync(directoryPath + file, (err) => {});
        }
      });

      await verificationItems.deleteOne();
      res.status(200).json({ message: "Deleted Successfully" });
    } else {
      res.status(403).json({ message: "Forbidden" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
