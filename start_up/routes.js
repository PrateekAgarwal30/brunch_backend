const register = require('../routes/register');
const auth = require('../routes/auth');
const me = require("../routes/me")
const express = require('express');
const address = require('../routes/address');
module.exports = function routes(app){ 
    app.use('/api/register',register);
    app.use('/api/auth', auth);
    app.use("/api/me", me);
    app.use("/api/address", address);
    console.log('Routes Added');
}