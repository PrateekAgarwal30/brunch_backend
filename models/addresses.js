const Joi = require('joi');
const mongoose = require('mongoose');
const addressSchema = new mongoose.Schema({
    address1: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 64
    },
    address2: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 64
    },
    location: {
        type: Object,
        required: true
    },
    contact : {
        type : String,
        required : true,
        minlength : 10,
        maxlength : 10
    },
    tag : {
        type : String,
        minlength : 3,
        maxlength : 20
    }
    
});
const Address = mongoose.model("addresses", addressSchema);
function validateAddress(address) {
    const schema = {
        address1: Joi.string().min(5).max(64).required(),
        address2: Joi.string().min(5).max(64),
        location : Joi.object().required(),
        contact : Joi.string().min(10).max(10).required(),
        tag : Joi.string().min(3).max(20)

    }
    return Joi.validate(address, schema);
}


exports.Address = Address;
exports.validateAddress = validateAddress;