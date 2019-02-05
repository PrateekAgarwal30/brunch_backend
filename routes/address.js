const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const { Address, validateAddress } = require("../models/addresses");
const { User } = require("../models/user");
const _ = require("lodash");
const Fawn = require("fawn");
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId, "-password").populate(
      "details",
      "-_id"
    );
    res.status(200).send({
      _status: "success",
      _data: user
    });
  } catch (ex) {
    res.status(400).send({
      _status: "fail",
      _message: ex.message
    });
  }
});
router.post("/", auth, async (req, res) => {
  try {
    console.log("Post - Address");
    const { error } = validateAddress(
      _.pick(req.body, [
        "address1",
        "address2",
        "location",
        "contact",
        "tag"
      ])
    );
    if (error) {
      return res.status(400).send({
        _status: "fail",
        _message: error.details[0].message
      });
    };
    let user = await User.findById(req.userId);
    console.log(user);
    const newAddress = new Address(_.pick(req.body, [
      "address1",
      "address2",
      "location",
      "contact",
      "tag"
    ]));
    user.addresses.push(newAddress._id);
    await newAddress.save();
    await user.save();
    res.status(200).send({
      _status: "success",
      _data: {newAddress,user}
    });
  } catch (ex) {
    res.status(400).send({
      _status: "fail",
      _message: ex.message
    });
  }
});
module.exports = router;
