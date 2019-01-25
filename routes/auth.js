const express = require('express');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const { User, validateUser } = require('../models/user');
const router = express.Router();
router.post('/', async (req, res) => {
    console.log("Post")
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

module.exports = router;