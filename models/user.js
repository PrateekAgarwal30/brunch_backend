const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 255,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  details: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "details"
  },
  wallet: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "wallets"
  },
  addresses: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "addresses"
  }
});
userSchema.methods.generateAuthToken = function() {
  console.log("jwtPrivateKey : ", config.get("jwtPrivateKey"));
  const token = jwt.sign({ _id: this._id }, config.get("jwtPrivateKey"));
  return token;
};
const User = mongoose.model("users", userSchema);

function validateUser(user) {
  const schema = {
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(5)
      .max(1024)
      .required()
  };
  return Joi.validate(user, schema);
}

function changePasswordValidation(data) {
  const schema = {
    oldp: Joi.string()
      .min(5)
      .max(1024)
      .required(),
    confirmp: Joi.string()
      .min(5)
      .max(1024)
      .required(),
    newp: Joi.string()
      .min(5)
      .max(1024)
      .required()
  };
  return Joi.validate(data, schema);
}
exports.User = User;
exports.validateUser = validateUser;
exports.changePasswordValidation = changePasswordValidation;
