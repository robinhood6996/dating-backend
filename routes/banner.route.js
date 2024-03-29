const express = require("express");
const router = express.Router();
const Banner = require("../controller/bannerController");
const multer = require("multer");
const { authenticate } = require("../middleware/tokenMiddleware");
const storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, "./uploads/banner");
  },
  filename: function (request, file, callback) {
    callback(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });
// POST route to add a new banner
router.post(
  "/",
  authenticate,
  upload.any([
    { name: "image", maxCount: 1 },
    { name: "bank", maxCount: 1 },
  ]),
  Banner.addBanner
);
router.get("/", Banner.getAllBanners);
router.get("/all", Banner.getPositionBanners);
router.get("/my", authenticate, Banner.getMyBanners);
router.put("/hold", authenticate, upload.any(), Banner.holdBanner);
router.delete("/delete", authenticate, Banner.deleteBanner);
router.put("/:bannerId", authenticate, upload.any(), Banner.updateAdStatus);

module.exports = router;
