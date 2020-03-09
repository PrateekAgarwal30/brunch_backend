const express = require("express");
const router = express.Router();
const multer = require("multer");

const mealFileFilter = function(req, file, cb) {
  // console.log("FileFilter - file", file);
  cb(null, file.mimetype === "image/png" || file.mimetype === "image/jpeg");
};

const mealUploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
  },
  fileFilter: mealFileFilter
});
const auth = require("../middleware/auth");
const adminController = require("./../controllers/adminController");
router.post(
  "/stall_location",
  auth,
  adminController.postNewStallLocationForTechPark
);
router.post("/techpark", auth, adminController.postNewTechPark);
module.exports = router;

router.post(
  "/meal",
  mealUploadMiddleware.single("mealImage"),
  adminController.postNewMeal
);
