const bcrypt = require("bcrypt");
const {
  User,
  validateUser,
  changePasswordValidation
} = require("../models/user");
const { Detail } = require("../models/detail");
const { Wallet } = require("../models/wallet");
const mongoose = require("mongoose");
const Fawn = require("fawn");
Fawn.init(mongoose);
const _ = require("lodash");
const postAuth = async (req, res) => {
  // console.log("Post")
  const { error } = validateUser(_.pick(req.body, ["email", "password"]));
  if (error) {
    return res.status(400).send({
      _status: "fail",
      _message: error.details[0].message
    });
  }
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).send({
        _status: "fail",
        _message: "User does not exist"
      });
    }
    const validUser = await bcrypt.compare(req.body.password, user.password);
    if (!validUser) {
      return res.status(401).send({
        _status: "fail",
        _message: "Invalid Email or Password"
      });
    } else {
      const token = user.generateAuthToken();
      return res
        .status(200)
        .header("x-auth-token", token)
        .send({
          _status: "success",
          _message: "Login Successful"
        });
    }
  } catch (ex) {
    return res.status(500).send({
      _status: "fail",
      _message: `Internal Error`
    });
  }
};
const postChangePassword = async (req, res) => {
  // console.log("change_password");
  const { error } = changePasswordValidation(
    _.pick(req.body, ["oldp", "confirmp", "newp"])
  );
  if (error) {
    return res.status(400).send({
      _status: "fail",
      _message: error.details[0].message
    });
  }
  if (req.body.confirmp != req.body.newp) {
    return res.status(400).send({
      _status: "fail",
      _message: "New Password and Confirm Password Mismatch."
    });
  }
  if (req.body.oldp === req.body.newp) {
    return res.status(400).send({
      _status: "fail",
      _message: "New Password and Old Password can't be Same."
    });
  }
  try {
    const user = await User.findById(req.userId, "password");
    const validUser = await bcrypt.compare(req.body.oldp, user.password);
    if (!validUser) {
      return res.status(401).send({
        _status: "fail",
        _message: "Invalid Password"
      });
    } else {
      const salt = await bcrypt.genSalt(10);
      // console.log(salt);
      user.password = await bcrypt.hash(req.body.newp, salt);
      await user.save();
      res.status(200).send({
        _status: "success",
        _data: _.pick(user, ["_id"])
      });
    }
  } catch (ex) {
    res.status(400).send({
      _status: "fail",
      _message: ex.message
    });
  }
};
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
    const wallet = new Wallet({
      userId: user._id,
      walletBalance: 0.01
    });
    user.details = detail._id;
    user.wallet = wallet._id;
    Fawn.Task()
      .save("users", user)
      .save("details", detail)
      .save("wallets", wallet)
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
  postAuth,
  postChangePassword,
  registerUser
};
