const express = require("express");
const router = express.Router();
const auth = require("./../middleware/auth");
const txnPaytmController = require("./../controllers/txnPaytmController");
router.post("/", auth, txnPaytmController.postTxn);
router.post("/status", txnPaytmController.getTxnRes);
module.exports = router;
