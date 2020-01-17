const Joi = require("joi");
const mongoose = require("mongoose");
const txnSchema = new mongoose.Schema({});
const Transaction = mongoose.model("transactions", txnSchema);
exports.Transaction = Transaction;
