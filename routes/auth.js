const express = require("express");
const router = express.Router();
const auth = require("./../middleware/auth");
const authController = require("./../controllers/authController");
router.post("/", authController.postAuth);
router.post("/register", authController.registerUser);
router.post("/change_password", auth, authController.postChangePassword);
module.exports = router;
