const _ = require("lodash");
const config = require("config");
const checksum_lib = require("../utils/paytm/checksum");
const { pushNotificationForUser } = require("../utils/expo_push_notification");
const { User } = require("../models/user");
const { Detail } = require("../models/detail");
const moment = require("moment");
const paypal = require("paypal-rest-sdk");
paypal.configure({
  mode: config.get("PAYPAL_MODE"), //sandbox or live
  client_id: config.get("PAYPAL_CLIENT_ID"),
  client_secret: config.get("PAYPAL_CLIENT_SECRET")
});
const postPaytmTxn = async (req, res) => {
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
const getPaytmTxnRes = async (req, res) => {
  try {
    const { body: bodyData } = req;
    if (bodyData["RESPCODE"] === "01") {
      try {
        const userId = _.get(req, "query.userId", null);
        if (userId) {
          let user = await User.findById(userId).select("details");
          if (user.details) {
            let details = await Detail.findById(user.details);
            if (details["pushNotifToken"]) {
              await pushNotificationForUser(details["pushNotifToken"], {
                title: "Order Placed Successfully!",
                body: `Order #${
                  bodyData.ORDERID
                } was placed successfully (${moment(
                  bodyData.TXNDATE
                ).calendar()})`,
                priority: "high",
                sound: "default"
              });
            }
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    const responseData = {
      _status: bodyData["RESPCODE"] === "01" ? "success" : "fail",
      _data: bodyData
    };
    return res.render("paytm/response", { responseData });
  } catch (err) {
    return res.render("paytm/response", {
      responseData: {
        _status: "fail",
        _message: err.message
      }
    });
  }
};

const postPayPalTxn = async (req, res) => {
  try {
    const paramlist = req.body;
    var transactionsData = [
      {
        item_list: {
          items: [
            {
              name: "item",
              sku: "item",
              price: paramlist["TXN_AMOUNT"],
              currency: "INR",
              quantity: 1
            }
          ]
        },
        amount: {
          currency: "INR",
          total: paramlist["TXN_AMOUNT"]
        },
        description: "This is the payment description."
      }
    ];
    var create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal"
      },
      redirect_urls: {
        return_url: encodeURI(
          `${
            paramlist["CALLBACK_URL"]
          }?statusPath=success&transactionsData=${JSON.stringify(
            transactionsData
          )}`
        ),
        cancel_url: encodeURI(
          `${
            paramlist["CALLBACK_URL"]
          }?statusPath=failed&transactionsData=${JSON.stringify(
            transactionsData
          )}`
        )
      },
      transactions: transactionsData
    };
    paypal.payment.create(create_payment_json, function(error, payment) {
      if (error) {
        throw error;
      } else {
        console.log(JSON.stringify(payment, null, 2));
        res.render("paypal/request", { redirect_link: payment.links[1].href });
        // res.redirect(payment.links[1].href);
      }
    });
  } catch (err) {
    return res.status(400).send({
      _status: "fail",
      _message: err.message
    });
  }
};
const getPayPalTxnRes = async (req, res) => {
  try {
    var statusPath = req.query.statusPath;
    if (statusPath === "success") {
      var PayerID = req.query.PayerID;
      var paymentId = req.query.paymentId;
      var transactionsData = JSON.parse(req.query.transactionsData);
      var execute_payment_json = {
        payer_id: PayerID,
        transactions: transactionsData
      };
      paypal.payment.execute(paymentId, execute_payment_json, function(
        error,
        payment
      ) {
        if (error) {
          res.render("paypal/response", {
            responseData: {
              _status: "fail"
            }
          });
        } else {
          res.render("paypal/response", {
            responseData: {
              _status: "success",
              _data: payment
            }
          });
        }
      });
    } else {
      res.render("paypal/response", {
        responseData: {
          _status: "fail"
        }
      });
    }
  } catch (err) {
    res.render("paypal/response", {
      responseData: {
        _status: "fail"
      }
    });
  }
};
// postPayPalTxn();
module.exports = {
  postPaytmTxn,
  getPaytmTxnRes,
  postPayPalTxn,
  getPayPalTxnRes
};
