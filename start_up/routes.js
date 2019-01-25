const register = require('../routes/register');
const auth = require('../routes/auth');
const express = require('express');
module.exports = function routes(app){ 
    app.use('/api/register',register);
    app.use('/api/auth', auth);
    console.log('Routes Added');
}