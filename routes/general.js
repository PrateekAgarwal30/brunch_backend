const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const generalController = require("./../controllers/generalController");
router.get("/techparks", auth, generalController.getTechParks);
module.exports = router;
