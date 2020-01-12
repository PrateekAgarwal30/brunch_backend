const { TechParkAddress } = require("../models/tech_parks");
const getTechParks = async (req, res) => {
  try {
    const addresses = await TechParkAddress.find().populate("stall_locations");
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
module.exports = {
  getTechParks
};
