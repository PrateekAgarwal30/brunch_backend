const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { Address, validateAddress,validateLocation,StallLocation} = require("../models/tech_parks");
const { User } = require("../models/user");
const _ = require("lodash");
const Fawn = require("fawn");
router.get("/", auth, async (req, res) => {
  try {
    const addresses = await Address.find().populate(
      "stall_locations"
    );
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
});
router.post("/", auth, async (req, res) => {
  try {
    console.log("Post - Tech Address");
    let addAddress = _.pick(req.body, [
      "techPark",
      "company",
      "tPark_location",
      "address",
      "area",
      "city",
    ]);
    let { error } = validateAddress(
      addAddress
    );
    if (error) {
      return res.status(400).send({
        _status: "fail",
        _message: error.details[0].message
      });
    }
    const newAddress = new Address({ ...addAddress, stall_locations:[]});
    // await Fawn.Task()
    //   .save("tech_parks", newAddress)
    //   .run()
    await newAddress.save();
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

router.post("/location", auth, async (req, res) => {
  try {
    console.log("Post - Stall Location");
    let addLocation = _.pick(req.body, [
      "location",
      "tag",
    ]);
    let { error } = validateLocation(
      addLocation
    );
    if (error) {
      return res.status(400).send({
        _status: "fail",
        _message: error.details[0].message
      });
    }

    let tech_park = await Address.findById(req.body.tech_park_id);
    if (!tech_park) {
      return res.status(400).send({
        _status: "fail",
        _message: "Invalid Tech Park Id"
      });
    }
    const newLocation = new StallLocation(_.pick(req.body, [
      "location",
      "tag"
    ]));
    tech_park.stall_locations.push(newLocation._id);
    await Fawn.Task()
      .save("stall_locations", newLocation)
      .update("tech_parks", { _id: tech_park._id }, { stall_locations: tech_park.stall_locations })
      .run()
    res.status(200).send({
      _status: "success",
      _data: { tech_park, newLocation }
    });
  } catch (ex) {
    res.status(400).send({
      _status: "fail",
      _message: ex.message
    });
  }
});
module.exports = router;
