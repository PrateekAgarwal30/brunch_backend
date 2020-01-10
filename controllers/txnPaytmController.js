const _ = require("lodash");
const config = require("config");
const checksum_lib = require("../utils/paytm/checksum");
const { pushNotificationForUser } = require("../utils/expo_push_notification");
const { User } = require("../models/user");
const { Detail } = require("../models/detail");
const postTxn = async (req, res) => {
  try {
    const paramlist = req.body;
    let params = {};
    params["MID"] = config.get("PAYTM_MID");
    params["WEBSITE"] = config.get("PAYTM_WEBSITE");
    params["CHANNEL_ID"] = config.get("PAYTM_CHANNEL_ID");
    params["INDUSTRY_TYPE_ID"] = config.get("PAYTM_INDUSTRY_TYPE_ID");
    params["ORDER_ID"] = paramlist["ORDER_ID"];
    params["CUST_ID"] = paramlist["CUST_ID"];
    params["TXN_AMOUNT"] = paramlist["TXN_AMOUNT"];
    params[
      "CALLBACK_URL"
    ] = `${paramlist["CALLBACK_URL"]}?userId=${req.userId}`;
    _.map(_.keysIn(params), param => {
      if (!params[param]) {
        throw new Error("Invalid Request");
      }
    });
    if (paramlist["EMAIL"]) {
      params["EMAIL"] = paramlist["EMAIL"];
    }
    if (paramlist["MOBILE_NO"]) {
      params["MOBILE_NO"] = paramlist["MOBILE_NO"];
    }
    checksum_lib.genchecksum(params, config.get("PAYTM_MERCHANT_KEY"), function(
      err,
      checksum
    ) {
      if (err) {
        throw new Error("System Error");
      }
      params["CHECKSUMHASH"] = checksum;
      return res.render("paytm/request", { params });
    });
  } catch (err) {
    return res.status(400).send({
      _status: "fail",
      _message: err.message
    });
  }
};
const getTxnRes = async (req, res) => {
  try {
    const responseData = {
      _status: "success",
      _data: req.body
    };
    try {
      const userId = _.get(req, "query.userId", null);
      if (userId) {
        let user = await User.findById(userId).select("details");
        if (user.details) {
          let details = await Detail.findById(user.details);
          if (details["pushNotifToken"]) {
            await pushNotificationForUser(
              details["pushNotifToken"],
              "Order Created Successfully!",
              {}
            );
          }
        }
      }
    } catch (error) {
      console.log(error.message);
    }
    return res.render("paytm/response", { responseData });
  } catch (err) {
    return res.render("paytm/response", {
      responseData: {
        _status: "fail",
        _data: err.message
      }
    });
  }
};
module.exports = {
  postTxn,
  getTxnRes
};
