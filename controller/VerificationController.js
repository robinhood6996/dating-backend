const { EscortProfile } = require("../models/escort.model");
const {
  verification: VerificationModel,
} = require("../models/verification.model");

exports.verificationRequest = async (req, res) => {
  try {
    let user = req.user;
    if (req.files) {
      let files = req.files;
      let escort = await EscortProfile.findOne({ email: user.email });
      console.log(escort);
      const verification = new VerificationModel({
        name: escort.name,
        userEmail: user.email,
        username: escort.username,
        photos: files,
        status: "pending",
      });
      await verification.save();
      return res.status(200).json({
        message: "Verification request sent",
        statusCode: 200,
      });
    }
    res.send();
  } catch (error) {
    return res.status(500).json({ message: "Error", error, statusCode: 500 });
  }
};
exports.verificationApprove = async (req, res) => {
  try {
    let user = req.user;
    if (user.type === "admin") {
      if (req.query) {
        let { id, status } = req.query;
        let verification = await VerificationModel.findOne({ _id: id });
        verification.status = status;
        let escort = await EscortProfile.findOne({
          email: verification.userEmail,
        });
        if (escort) {
          escort.verified = status === "approved" ? true : false;
          await verification.save();
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
    return res.status(500).json({ message: "Error", error, statusCode: 500 });
  }
};
