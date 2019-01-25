const register = require('../routes/register');
const express = require('express');
module.exports = function routes(app){ 
    app.use('/api/register',register);
    console.log('done');
}