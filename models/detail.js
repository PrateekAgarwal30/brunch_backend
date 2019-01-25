const Joi = require("joi");
const mongoose = require("mongoose");
const detailSchema = new mongoose.Schema({
    firstName: {
        type: String,
        minlength: 3,
        maxlength: 50
    },
    lastName: {
        type: String,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255
    },
    address: {
        type: String,
        minlength: 5,
        maxlength: 255
    },
    city: {
        type: String,
        minlength: 3,
        maxlength: 20
    },
    state: {
        type: String,
        minlength: 3,
        maxlength: 20
    },
    phoneNumber: {
        type: String,
        minlength: 10,
        maxlength: 10,
        validate: {
            validator: function (v) { return +v > 0; },
            message: 'Invalid Mobile Number'
        }
    }
});
const Detail = mongoose.model("details", detailSchema);

function validateDetails(detail) {
    const schema = {
        firstName: Joi.string()
            .min(3)
            .max(50),
        lastName: Joi.string()
            .min(3)
            .max(50),
        phoneNumber: Joi.string()
            .length(10),
        email: Joi.string()
            .min(5)
            .max(255)
            .required()
            .email(),
        address: Joi.string()
            .min(5)
            .max(511),
        city: Joi.string()
            .min(3)
            .max(20),
        state: Joi.string()
            .ming(3)
            .max(20)
    };
    return Joi.validate(detail, schema);
}

exports.Detail = Detail;
exports.validateDetails = validateDetails;
