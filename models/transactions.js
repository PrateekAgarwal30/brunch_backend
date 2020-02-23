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
  gatewayTxnId: {
    type: String,
    required: true,
    unique: true
  },
  gatewayMode: {
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
  },
  currency: {
    type: String,
    enum: ["INR"],
    required: true
  },
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  paymentMode: {
    type: String,
    enum: ["WALLET", "NETBANKING", "UPI", "CREDITCARD", "DEBITCARD"],
    required: true
  },
  bank: {
    type: String
  },
  wallet: {
    type: String
  },
  vpa: {
    type: String
  },
  bankTxnId: {
    type: String
  }
});
const Transaction = mongoose.model("transactions", txnSchema);
exports.Transaction = Transaction;
