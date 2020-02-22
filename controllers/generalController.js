const _ = require("lodash");
const { TechParkAddress } = require("../models/tech_parks");
const { Meal } = require("../models/meals");
const getTechParks = async (req, res) => {
  try {
    const query = { 
      $regex: ".*" + (req.query.searchAddressQuery || "") + ".*",
      $options:'i'
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
module.exports = {
  getTechParks,
  getMeals,
  getColors
};
