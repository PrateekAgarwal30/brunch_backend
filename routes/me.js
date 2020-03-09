const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const meController = require("./../controllers/meController");

const multer = require("multer");

const avatarFileFilter = function(req, file, cb) {
  console.log("FileFilter - file", file);
  cb(null, file.mimetype === "image/png" || file.mimetype === "image/jpeg");
};

const avatarUploadMiddleware = multer({
  storage: multer.memoryStorage(),
  fileFilter: avatarFileFilter
});

router.get("/", auth, meController.getUserDetails);
router.get("/transactions", auth, meController.getUserTransactions);
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
