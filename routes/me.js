const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('config');
const { User } = require('../models/user')
router.get('/', async (req, res) => {
    const jwtToken = req.get('x-auth-token')
    try {
        let user = jwt.verify(jwtToken, config.get('jwtPrivateKey'));
        user = await User.findById(user._id).populate('details',"-_id","-password");
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