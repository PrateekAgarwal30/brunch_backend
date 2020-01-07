const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads/avatars/");
  },
  filename: function(req, file, cb) {
    // console.log(file);
    cb(null, `${req.userId}.png`);
  }
});

const fileFilter = function(req, file, cb) {
  cb(null, file.mimetype === "image/png");
};
const avatarUploadMiddleware = multer({
  storage: storage,
  fileFilter: fileFilter
});
const meController = require("./../controllers/meController");
router.get("/", auth, meController.getUserDetails);
router.post("/details", auth, meController.postUserDetails);
router.post(
  "/user_image",
  auth,
  avatarUploadMiddleware.single("avatar"),
  meController.postUserImage
);
module.exports = router;
