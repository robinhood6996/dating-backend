const { EscortProfile } = require("../models/escort.model");
const { verification } = require("../models/verification.model");

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
      if (files.length < 2) {
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
  const { status } = req.query;
  const { type } = req.user;
  try {
    let query = {};
    if (status) {
      query.status = status;
    }

    const verificationItems = await verification.find(query);
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
  console.log("verification", id);
  try {
    const verificationItems = await verification.findOne({ _id: id });
    console.log("verification", verificationItems);
    await verificationItems.deleteOne();
    res.status(200).json({ message: "Deleted Successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
