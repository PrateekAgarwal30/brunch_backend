const register = require('../routes/register');
const auth = require('../routes/auth');
const me = require("../routes/me")
const express = require('express');
const address = require('../routes/address');
const techAddresses = require('../routes/techAddresses');
const txnPaytm = require('../routes/txnPaytm');
module.exports = function routes(app){ 
    app.use('/api/register',register);
    app.use('/api/auth', auth);
    app.use("/api/me", me);
    app.use("/api/address", address);
    app.use("/api/tech_address", techAddresses);
    app.use("/api/txnPaytm", txnPaytm);
    console.log('Routes Added');
}