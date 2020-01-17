const express = require("express");
const router = express.Router();
const multer = require("multer");
const mealStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads/meals/");
  },
  filename: function(req, file, cb) {
    let fileName = "";
    let type = file.mimetype === "image/png" ? "png" : "jpg";
    if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
      fileName = `meal_${Date.now().toString()}.${type}`;
      cb(null, fileName);
    } else {
      cb(null, null);
    }
  }
});

const mealFileFilter = function(req, file, cb) {
  console.log("FileFilter - file", file);
  cb(null, file.mimetype === "image/png" || file.mimetype === "image/jpeg");
};
const mealUploadMiddleware = multer({
  storage: mealStorage,
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
