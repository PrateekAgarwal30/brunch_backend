const express = require('express');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const { User, validateUser,changePasswordValidation } = require('../models/user');
const router = express.Router();
const auth = require("./../middleware/auth");
router.post('/', async (req, res) => {
    // console.log("Post")
    const { error } = validateUser(_.pick(req.body, ["email", "password"]));
    if (error) {
        return res.status(400).send({
            _status: 'fail',
            _message: error.details[0].message
        });
    }
    try {
        let user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).send({
                _status: 'fail',
                _message: "User does not exist"
            });
        }
        const validUser = await bcrypt.compare(req.body.password, user.password);
        if (!validUser) {
            return res
                .status(401)
                .send({
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
            _status: 'fail',
            _message: `Internal Error`
        });
    }
});
router.post("/change_password", auth,async (req, res) => {
    // console.log("change_password");
  const { error } = changePasswordValidation(_.pick(req.body, ["oldp","confirmp", "newp"]));
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
        }else{
            const salt = await bcrypt.genSalt(10);
            // console.log(salt);
            user.password = await bcrypt.hash(req.body.newp, salt);
            await user.save();
            res.status(200).send({
                _status: "success",
                _data: _.pick(user,["_id"])
            });
        }

    } catch (ex) {
        res.status(400).send({
            _status: "fail",
            _message: ex.message
        });
    }
});

module.exports = router;