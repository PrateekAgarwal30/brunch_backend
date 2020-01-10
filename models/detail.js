const Joi = require("joi");
const mongoose = require("mongoose");
const detailSchema = new mongoose.Schema({
  firstName: {
    type: String,
    minlength: 3,
    maxlength: 50
  },
  lastName: {
    type: String,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 255,
    lowercase: true
  },
  location: {
    type: String,
    minlength: 3,
    maxlength: 20
  },
  phoneNumber: {
    type: String,
    minlength: 10,
    maxlength: 10,
    validate: {
      validator: function(v) {
        return +v > 0;
      },
      message: "Invalid Mobile Number"
    }
  },
  dateOfBirth: {
    type: Date
  },
  preferredMeal: {
    type: String,
    enum: ["veg", "nonVeg"]
  },
  description: {
    type: String,
    maxlength: 150
  },
  userImageUrl: {
    type: String
  },
  pushNotifToken: {
    type: String
  }
});
const Detail = mongoose.model("details", detailSchema);

function validateDetails(detail) {
  const schema = {
    firstName: Joi.string()
      .min(3)
      .max(50),
    lastName: Joi.string()
      .min(3)
      .max(50),
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    location: Joi.string()
      .min(3)
      .max(20),
    phoneNumber: Joi.string()
      .min(10)
      .max(10),
    dateOfBirth: Joi.date(),
    preferredMeal: Joi.string(),
    description: Joi.string()
      .min(5)
      .max(150)
  };
  return Joi.validate(detail, schema);
}

function validateUpdateDetails(detail) {
  const schema = {
    firstName: Joi.string()
      .min(3)
      .max(50),
    lastName: Joi.string()
      .min(3)
      .max(50),
    location: Joi.string()
      .min(3)
      .max(20),
    phoneNumber: Joi.string()
      .min(10)
      .max(10),
    dateOfBirth: Joi.date(),
    preferredMeal: Joi.string(),
    description: Joi.string()
      .min(5)
      .max(150)
  };
  return Joi.validate(detail, schema);
}
exports.Detail = Detail;
exports.validateDetails = validateDetails;
exports.validateUpdateDetails = validateUpdateDetails;
