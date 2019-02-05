const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('config');
const { User } = require('../models/user');
const auth = require('../middleware/auth')
router.get('/', auth,async (req, res) => {
    const jwtToken = req.get('x-auth-token')
    try {
        let user = jwt.verify(jwtToken, config.get('jwtPrivateKey'));
        user = await User.findById(user._id, "-password").populate('details',"-_id");
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
module.exports = router;