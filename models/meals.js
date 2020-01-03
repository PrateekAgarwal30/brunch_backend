const Joi = require("joi");
const mongoose = require("mongoose");
const mealSchema = new mongoose.Schema({
    name : {
        type : String,
        minlength : 3,
        maxlength : 50,
        required : true
    },
    status : {
        type : String,
        enum : ['active','inactive'],
        default : 'active'
    },
    type : {
        type : String,
        enum : ['veg','nonveg'],
        required : true
    },
    price : {
        type : Number,
        min : 1,
        required : true
    },
    description : {
        type : String,
        required : true,
        minlength : 5,
        maxlength : 150
    },
    image : {
        type : String
    }
});

const Meal = mongoose.model("meals", mealSchema);

function validateMeal(meal) {
    const schema = {
    };
    return Joi.validate(meal, schema);
}

exports.Meal = Meal;
exports.validateMeal = validateMeal;
