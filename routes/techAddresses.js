const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const techAddressesController = require("./../controllers/techAddressesController");
router.get("/", auth, techAddressesController.getTechParks);
router.post("/", auth, techAddressesController.postNewTechPark);
router.post(
  "/location",
  auth,
  techAddressesController.postNewStallLocationForTechPark
);
module.exports = router;
