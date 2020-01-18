const Joi = require("joi");
const mongoose = require("mongoose");
const txnSchema = new mongoose.Schema({
  walletId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "wallets"
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "users"
  },
  status: {
    type: String,
    enum: ["Success", "Failed", "Hold", "Refunded"],
    required: true
  },
  extTxnId: {
    type: String,
    minlength: 8,
    maxlength: 15,
    required: true,
    unique: true
  },
  paymentMode: {
    type: String,
    enum: ["Paytm", "Razorpay", "Paypal"],
    required: true
  },
  transactionDate: {
    type: Date,
    required: true
  },
  transactionAmount: {
    type: Number,
    min: 1.0,
    required: true
  }
});
const Transaction = mongoose.model("transactions", txnSchema);
exports.Transaction = Transaction;
