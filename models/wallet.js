const Joi = require("joi");
const mongoose = require("mongoose");
const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "users"
  },
  walletBalance: {
    type: Number,
    required: true,
    default: 0
  },
  transactions: {
    type: [Object.Schema.Types.ObjectId],
    default: [],
    ref: "transactions"
  }
});
const Wallet = mongoose.model("wallets", walletSchema);
exports.Wallet = Wallet;
