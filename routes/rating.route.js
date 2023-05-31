const express = require("express");
const { authenticate } = require("../middleware/tokenMiddleware");
const RatingController = require("../controller/ratingController");
const upload = require("multer")();
const router = express.Router();

router.post("/add", authenticate, upload.any(), RatingController.addRating);
router.get("/", authenticate, upload.any(), RatingController.getAllRatings);
router.delete(
  "/:ratingId",
  authenticate,
  upload.any(),
  RatingController.deleteReviews
);
router.get(
  "/:ratingId",
  authenticate,
  upload.any(),
  RatingController.getSingleRatings
);
router.get(
  "/user-ratings",
  authenticate,
  upload.any(),
  RatingController.getRatingsByUsernames
);

module.exports = router;
