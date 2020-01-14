const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const txnController = require("./../controllers/txnController");
router.post("/paytm", auth, txnController.postPaytmTxn);
router.post("/paytm/status", txnController.getPaytmTxnRes);

router.post("/paypal", txnController.postPayPalTxn);
router.get("/paypal/status", txnController.getPayPalTxnRes);

router.get("/razorpay", txnController.postRazorPayTax);
router.post("/razorpay/status", txnController.getRazorPayTaxRes);
router.get("/razorpay/status", txnController.getRazorPayTaxRes);
module.exports = router;
