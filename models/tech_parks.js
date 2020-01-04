const Joi = require("joi");
const mongoose = require("mongoose");
const locationSchema = new mongoose.Schema({
  tag: {
    type: String,
    required: true
  },
  location: {
    type: Object,
    required: true,
    validate: {
      validator: function(v) {
        console.log(v);
        return (
          v.latitude != null &&
          v.latitude != undefined &&
          v.longitude != null &&
          v.longitude != undefined &&
          !isNaN(v.longitude) &&
          !isNaN(v.latitude)
        );
      },
      message: "Invalid Location"
    }
  }
});
const addressSchema = new mongoose.Schema({
  techPark: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 64
  },
  company: {
    type: String,
    minlength: 5,
    maxlength: 64
  },
  tPark_location: {
    type: Object,
    required: true,
    validate: {
      validator: function(v) {
        return (
          v.latitude != null &&
          v.latitude != undefined &&
          v.longitude != null &&
          v.longitude != undefined &&
          !isNaN(v.longitude) &&
          !isNaN(v.latitude)
        );
      },
      message: "Invalid Location"
    }
  },
  stall_locations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "stall_locations"
    }
  ],
  address: {
    type: String,
    required: true
  },
  area: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  }
});
const Address = mongoose.model("tech_parks", addressSchema);
const StallLocation = mongoose.model("stall_locations", locationSchema);
function validateLocation(location) {
  const schema = {
    tag: Joi.string()
      .min(5)
      .max(64)
      .required(),
    location: Joi.object().required()
  };
  return Joi.validate(location, schema);
}
function validateAddress(address) {
  const schema = {
    techPark: Joi.string()
      .min(5)
      .max(64)
      .required(),
    company: Joi.string()
      .min(5)
      .max(64),
    tPark_location: Joi.object().required(),
    address: Joi.string()
      .min(5)
      .max(150)
      .required(),
    area: Joi.string()
      .min(5)
      .max(64)
      .required(),
    city: Joi.string()
      .min(3)
      .max(64)
      .required()
  };
  return Joi.validate(address, schema);
}

exports.Address = Address;
exports.StallLocation = StallLocation;
exports.validateAddress = validateAddress;
exports.validateLocation = validateLocation;
