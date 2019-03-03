const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { Address, validateAddress } = require("../models/tech_parks");
const { User } = require("../models/user");
const _ = require("lodash");
const Fawn = require("fawn");
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId, "-password").populate(
      "details",
      "-_id"
    ).populate(
      "addresses"
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
    console.log("Post - Tech Address");
    const { error } = validateAddress(
      _.pick(req.body, [
        "techPark",
        "company",
        "locations",
        "address",
        "area",
        "city",
      ])
    );
    if (error) {
      return res.status(400).send({
        _status: "fail",
        _message: error.details[0].message
      });
    };
    const newAddress = new Address(_.pick(req.body, [
      "techPark",
      "company",
      "locations",
      "address",
      "area",
      "city",
    ]));
    await Fawn.Task()
      .save("tech_parks", newAddress)
      .run()
    res.status(200).send({
      _status: "success",
      _data: {newAddress}
    });
  } catch (ex) {
    res.status(400).send({
      _status: "fail",
      _message: ex.message
    });
  }
});
module.exports = router;
