const jwt = require("jsonwebtoken");
const config = require("config");
const _ = require("lodash");
const auth = function (req, res, next) {
    try {
        let jwtToken;
        if (_.includes(req.originalUrl, 'api/txn')) {
            jwtToken = req.body["x-auth-token"];
        } else {
            jwtToken = req.get("x-auth-token");
        }
        let user = jwt.verify(jwtToken, config.get("jwtPrivateKey"));
        req.userId = user._id;
        next();
    } catch (ex) {
        res
            .status(400)
            .send({_status: "fail", _message: ex.message});
    }
};

module.exports = auth;
