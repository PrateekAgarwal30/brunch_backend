const express = require('express');
const router = express.Router();
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
        const keys = Object.keys(mDetails);
        keys.map((x)=>{
            if (mDetails[x]===null){
                delete mDetails[x];
            }
        })
        console.log(mDetails);
        console.log("Post - Details");
        const { error } = validateUpdateDetails(mDetails);
        if (error) {
            if (error.details[0].message === 'firstName" is not allowed to be empty'){
                return res.status(400).send({
                    _status: "fail",
                    _message: "First Name is required"
                });
            }else{
                return res.status(400).send({
                    _status: "fail",
                    _message: error.details[0].message
                });
            }

        };
        let user = await User.findById(req.userId).select("details");
        if (user.details) {
            let details = await Detail.findById(user.details);
            keys.map((x) => {
                if (mDetails[x]) {
                    details[x] = mDetails[x];
                }
            });
            console.log(details);
            await details.save();
            console.log(details)
            res.status(200).send({
                _status: "success",
                _data: details
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