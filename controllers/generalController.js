const _ = require("lodash");
const { TechParkAddress } = require("../models/tech_parks");
const { Meal } = require("../models/meals");
const getTechParks = async (req, res) => {
  try {
    const query = {
      $regex: ".*" + (req.query.searchAddressQuery || "") + ".*",
      $options: "i"
    };
    const addresses = await TechParkAddress.find({
      $or: [{ techPark: query }, { address: query }, { company: query }]
    })
      .limit(3)
      .populate("stall_locations");
    res.status(200).send({
      _status: "success",
      _data: addresses
    });
  } catch (ex) {
    res.status(400).send({
      _status: "fail",
      _message: ex.message
    });
  }
};

const getMeals = async (req, res) => {
  try {
    let meals = null;
    let params = req.params || {};
    if (_.keysIn(params).length) {
      meals = await Meal.find(params);
    } else {
      meals = await Meal.find({ status: "Active" });
    }
    res.status(200).send({
      _status: "success",
      _data: meals
    });
  } catch (ex) {
    res.status(400).send({
      _status: "fail",
      _message: ex.message
    });
  }
};

const getColors = async (req, res) => {
  res.render("colors");
};

const postCartItems = async (req, res) => {
  try {
    const { cartItems } = req.body;
    const response = {
      cartItems: [],
      priceDetails: {}
    };
    for (const cartItem of cartItems) {
      const mealData = await Meal.findById(
        cartItem.mealId,
        "-body -mealImageUrl"
      );
      if (mealData) {
        const meal = _.pick(mealData, [
          "_id",
          "name",
          "status",
          "type",
          "mealType",
          "price",
          "quantityAvailable",
          "mealThumbnailUrl"
        ]);
        if (
          meal.quantityAvailable < cartItem.quantity ||
          meal.status === "InActive"
        ) {
          response.cartItems.push({
            ...meal,
            disabled: true,
            errMessage: "Out of Stock",
            quantity: cartItem.quantity
          });
        } else {
          response.cartItems.push({
            ...meal,
            quantity: cartItem.quantity,
            itemTotalPrice: meal.price * cartItem.quantity
          });
        }
      }
    }
    const totalCartItemPrice = response.cartItems.reduce(
      (accumulator, currentValue) => {
        return accumulator + currentValue.itemTotalPrice;
      },
      0
    );
    if (totalCartItemPrice > 0) {
      const taxAmount = +(totalCartItemPrice * 0.05 || 0).toFixed(2);
      const totalCartPrice = +(totalCartItemPrice + taxAmount || 0).toFixed(2);
      response.priceDetails = { totalCartItemPrice, taxAmount, totalCartPrice };
    }
    res.status(200).send({
      _status: "success",
      _data: response
    });
  } catch (ex) {
    res.status(400).send({
      _status: "fail",
      _message: "Opps. Something went wrong. please try again"
    });
  }
};

module.exports = {
  getTechParks,
  getMeals,
  getColors,
  postCartItems
};
