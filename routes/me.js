const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const meController = require("./../controllers/meController");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads/avatars/");
  },
  filename: function(req, file, cb) {
    let fileName = "";
    let type = file.mimetype === "image/png" ? "png" : "jpg";
    if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
      fileName = `${req.userId}_${Date.now().toString()}.${type}`;
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

router.get("/", auth, meController.getUserDetails);
router.post("/details", auth, meController.postUserDetails);
router.post(
  "/user_image",
  auth,
  avatarUploadMiddleware.single("avatar"),
  meController.postUserImage
);
router.post("/user_push_notif_token", auth, meController.postUserNotifToken);
router.post("/user_address", auth, meController.postUserAddress);
module.exports = router;
