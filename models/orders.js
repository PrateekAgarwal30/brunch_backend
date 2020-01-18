const Joi = require("joi");
const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    minlength: 8,
    maxlength: 15,
    required: true,
    unique: true
  },
  orderStatus: {
    type: String,
    enum: ["Created", "Cancelled", "Completed", "InProcess"],
    required: true
  },
  transactionId: {
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
  customerId: {
    type: String,
    minlength: 8,
    maxlength: 15,
    required: true
  },
  transactionAmount: {
    type: Number,
    min: 1.0,
    required: true
  },
  shippingAddress: {
    type: Object,
    required: true,
    validate: {
      validator: function(v) {
        return (
          mongoose.Types.ObjectId.isValid(v.tech_park_id) &&
          mongoose.Types.ObjectId.isValid(v.stall_loc_id)
        );
      },
      message: "Invalid Shipping Address"
    }
  },
  orderNote: {
    type: String
  }
});

const Order = mongoose.model("orders", orderSchema);

function validateOrder(order) {
  const schema = {
    orderId: Joi.string()
      .min(8)
      .max(15)
      .required(),
    orderStatus: Joi.string()
      .valid("Created", "Cancelled", "Completed", "InProcess")
      .required(),
    transactionId: Joi.string()
      .min(8)
      .max(15)
      .required(),
    paymentMode: Joi.string()
      .valid("Paytm", "Razorpay", "Paypal")
      .required(),
    transactionDate: Joi.date().required(),
    customerId: Joi.string()
      .min(8)
      .max(15)
      .required(),
    transactionAmount: Joi.number()
      .min(1)
      .required(),
    shippingAddress: Joi.object()
      .keys({
        tech_park_id: Joi.string().required(),
        stall_loc_id: Joi.string().required()
      })
      .with("tech_park_id", "stall_loc_id"),
    orderNote: Joi.string()
  };
  return Joi.validate(meal, schema);
}

exports.Order = Order;
exports.validateOrder = validateOrder;
