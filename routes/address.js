const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { Address, validateAddress } = require("../models/addresses");
const { User } = require("../models/user");
const _ = require("lodash");
const Fawn = require("fawn");
// router.get("/", auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.userId, "-__v -password").populate(
//       "details",
//       "-_id"
//     ).populate(
//       "addresses"
//     );
//     res.status(200).send({
//       _status: "success",
//       _data: user
//     });
//   } catch (ex) {
//     res.status(400).send({
//       _status: "fail",
//       _message: ex.message
//     });
//   }
// });
router.post("/", auth, async (req, res) => {
  try {
    console.log("Post - Address");
    const { error } = validateAddress(
      _.pick(req.body, [
        "tech_park_id",
        "stall_loc_id",
      ])
    );
    if (error) {
      return res.status(400).send({
        _status: "fail",
        _message: error.details[0].message
      });
    }
    let user = await User.findById(req.userId,"-__v -password");
    if(!user){
      return res.status(400).send({
        _status: "fail",
        _message: "Invalid User"
      });
    }
    const newAddress = new Address(_.pick(req.body, [
      "tech_park_id",
      "stall_loc_id",
    ]));
    user.addresses.push(newAddress._id);

    await Fawn.Task()
      .save("addresses", newAddress)
      .update("users", { _id: user._id }, { addresses :user.addresses})
      .run()
    res.status(200).send({
      _status: "success",
      _data: { newAddress, user }
    });
  } catch (ex) {
    res.status(400).send({
      _status: "fail",
      _message: ex.message
    });
  }
});
module.exports = router;
