const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const meController = require("./../controllers/meController");
router.get("/", auth, meController.getUserDetails);

router.post("/details", auth, meController.postUserDetails);
module.exports = router;
