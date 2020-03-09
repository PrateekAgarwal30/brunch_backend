const Joi = require("joi");
const mongoose = require("mongoose");
const mealSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 50,
    required: true
  },
  status: {
    type: String,
    enum: ["Active", "InActive"],
    required: true
  },
  type: {
    type: String,
    enum: ["Veg", "NonVeg"],
    required: true
  },
  mealType: {
    type: String,
    enum: ["Meal", "AddOn"],
    required: true
  },
  price: {
    type: Number,
    min: 1,
    required: true
  },
  subtitle: {
    type: String,
    minlength: 5,
    maxlength: 150
  },
  body: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 150
  },
  mealImageUrl: {
    type: String,
    required: true
  },
  mealThumbnailUrl: {
    type: String,
    required: true
  },
  quantityAvailable: {
    type: Number,
    required: true
  }
});

const Meal = mongoose.model("meals", mealSchema);

function validateMeal(meal) {
  const schema = {
    name: Joi.string()
      .min(3)
      .max(50)
      .required(),
    status: Joi.string()
      .valid("Active", "InActive")
      .required(),
    type: Joi.string()
      .valid("Veg", "NonVeg")
      .required(),
    mealType: Joi.string()
      .valid("Meal", "AddOn")
      .required(),
    price: Joi.number()
      .positive()
      .required(),
    subtitle: Joi.string()
      .min(5)
      .max(150),
    body: Joi.string()
      .min(5)
      .max(150)
      .required(),
    // mealImageUrl: Joi.string().required(),
    // mealThumbnailUrl: Joi.string().required(),
    quantityAvailable: Joi.number().required()
  };
  return Joi.validate(meal, schema);
}

exports.Meal = Meal;
exports.validateMeal = validateMeal;
