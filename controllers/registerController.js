const { User, validateUser } = require("../models/user");
const bcrypt = require("bcrypt");
const { Detail } = require("../models/detail");
const mongoose = require("mongoose");
const _ = require("lodash");
const Fawn = require("fawn");
Fawn.init(mongoose);
const registerUser = async (req, res) => {
  console.log("Post - REGISTER");
  const { error } = validateUser(_.pick(req.body, ["email", "password"]));
  if (error) {
    return res.status(400).send({
      _status: "fail",
      _message: error.details[0].message
    });
  }
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(401).send({
        _status: "fail",
        _message: "User already exist"
      });
    }
    user = new User(_.pick(req.body, ["email", "password"]));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    const token = user.generateAuthToken();
    console.log(token);
    const detail = new Detail(_.pick(req.body, ["email"]));
    user.details = detail._id;
    Fawn.Task()
      .save("users", user)
      .save("details", detail)
      .run()
      .then(result => {
        return res
          .status(201)
          .header("x-auth-token", token)
          .send({
            _status: "success",
            _message: "User Registered Successfully"
          });
      })
      .catch(ex => {
        return res.status(500).send({
          _status: "fail",
          _message: `Internal Error`
        });
      });
  } catch (ex) {
    return res.status(500).send({
      _status: "fail",
      _message: `Internal Error`
    });
  }
};

module.exports = {
  registerUser
};
