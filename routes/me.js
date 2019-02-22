const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('config');
const { User } = require('../models/user');
const { Detail, validateUpdateDetails } = require('../models/detail');
const auth = require('../middleware/auth')
const _ = require("lodash");
router.get('/', auth, async (req, res) => {
    try {
        console.log(req.userId);
        user = await User.findById(req.userId, "-__v -password")
            .populate("details", "-__v -_id")
            .populate("addresses", "-__v");
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

router.post('/details', auth, async (req, res) => {
    try {
        const mDetails = _.pick(req.body, [
            "firstName",
            "lastName",
            "phoneNumber",
            "location",
            "dateOfBirth",
            "preferredMeal",
            "description"]);
        console.log("Post - Details");
        const { error } = validateUpdateDetails(mDetails);
        if (error) {
            return res.status(400).send({
                _status: "fail",
                _message: error.details[0].message
            });
        };
        let user = await User.findById(req.userId).select("details");
        if(user.details){
            let details = await Detail.findById(user.details);
        if(mDetails.firstName){
            details.firstName = mDetails.firstName
        }
        if (mDetails.lastName) {
            details.lastName = mDetails.lastName
        }
        if (mDetails.phoneNumber) {
            details.phoneNumber = mDetails.phoneNumber
        }
        if (mDetails.location) {
            details.location = mDetails.location
        }
        if (mDetails.dateOfBirth) {
            details.dateOfBirth = mDetails.dateOfBirth
        }
        if (mDetails.preferredMeal) {
            details.preferredMeal = mDetails.preferredMeal
        }
        if (mDetails.description) {
            details.description = mDetails.description
        }
        console.log(details);
        await details.save();
        res.status(200).send({
            _status: "success",
            _data: { details }
        });
    }
    } catch (ex) {
        res.status(400).send({
            _status: "fail",
            _message: ex.message
        });
    }
})
module.exports = router;