const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads/avatars/");
  },
  filename: function(req, file, cb) {
    let fileName = "";
    if (file.mimetype === "image/png") {
      fileName = `${req.userId}_${Date.now().toString()}.png`;
      cb(null, fileName);
    } else if (file.mimetype === "image/jpeg") {
      fileName = `${req.userId}_${Date.now().toString()}.jpg`;
      cb(null, fileName);
    } else {
      cb(null, null);
    }
  }
});

const fileFilter = function(req, file, cb) {
  console.log("FileFilter - file", file);
  cb(null, file.mimetype === "image/png" || file.mimetype === "image/jpeg");
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
