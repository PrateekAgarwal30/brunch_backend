const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
mongoose.set("useCreateIndex", true);
const db = function() {
  if (!config.get("db_connection")) {
    console.log("db_connection environment varaible is not set");
    //set vidly_jwtPrivateKey=mySecretKey in cmd
    process.exit(1);
  }
  mongoose
    .connect(config.get("db_connection"), {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(res => {
      console.log("Connected to MongoDB");
    })
    .catch(ex => {
      console.log(ex.message);
    });
};
module.exports = db;
