const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const generalController = require("./../controllers/generalController");
router.get("/techparks", auth, generalController.getTechParks);
router.get("/meals", generalController.getMeals);
router.get("/meals/:_id", generalController.getMeals);
router.get("/colors", generalController.getColors);
module.exports = router;
