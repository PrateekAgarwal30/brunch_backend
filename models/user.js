const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require("config");
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255,
        lowercase : true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    details : {
        type : mongoose.Types.ObjectId,
        required : true,
        ref : 'details'
    }
});
userSchema.methods.generateAuthToken = function(){
    console.log("jwtPrivateKey : ", config.get('jwtPrivateKey'));
    const token = jwt.sign({ _id: this._id }, config.get('jwtPrivateKey'));
    return token;
};
const User = mongoose.model('users', userSchema);

function validateUser(user) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(1024).required()
    }
    return Joi.validate(user, schema);
}


exports.User = User;
exports.validateUser = validateUser;