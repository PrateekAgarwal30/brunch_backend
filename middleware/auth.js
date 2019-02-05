const jwt = require('jsonwebtoken');
const config = require('config');
 const auth = function (req,res,next) {
    try {
    const jwtToken = req.get("x-auth-token");
    let user = jwt.verify(jwtToken, config.get("jwtPrivateKey"));
    req.userId = user._id;
    next();
  } catch (ex) {
    res.status(400).send({
      _status: "fail",
      _message: ex.message
    });
  }
 };

 module.exports = auth;

