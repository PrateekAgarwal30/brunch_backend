const Joi = require('joi');
const mongoose = require('mongoose');
const addressSchema = new mongoose.Schema({
    tech_park_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tech_parks',
        required: true,
    },
    stall_loc_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'stall_locations',
        required: true,
    }
});
const Address = mongoose.model("addresses", addressSchema);
function validateAddress(address) {
    const schema = {
        tech_park_id: Joi.string().required(),
        stall_loc_id: Joi.string().required(),
    }
    return Joi.validate(address, schema);
}


exports.Address = Address;
exports.validateAddress = validateAddress;