const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const adminController = require("./../controllers/adminController");
router.post(
  "/stall_location",
  auth,
  adminController.postNewStallLocationForTechPark
);
router.post("/techpark", auth, adminController.postNewTechPark);
module.exports = router;
