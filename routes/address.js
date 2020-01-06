const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const addressController = require("../controllers/addressController");
router.get("/", auth, addressController.getAddress);
router.post("/", auth, addressController.postAddress);
module.exports = router;
