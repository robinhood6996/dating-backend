const express = require("express");
const { authenticate } = require("../middleware/tokenMiddleware");
const RatingController = require("../controller/ratingController");
const upload = require("multer")();
const router = express.Router();

router.post("/add", authenticate, upload.any(), RatingController.addRating);
router.get("/", upload.any(), RatingController.getAllRatings);
router.delete(
  "/:ratingId",
  authenticate,
  upload.any(),
  RatingController.deleteReviews
);
router.get("/user-ratings", RatingController.getRatingsByUsernames);
router.get("/:ratingId", upload.any(), RatingController.getSingleRatings);
router.post(
  "/add-reply",
  authenticate,
  upload.any(),
  RatingController.addReply
);

module.exports = router;
