const _ = require("lodash");
const config = require("config");
const checksum_lib = require("../utils/paytm/checksum");
const { pushNotificationForUser } = require("../utils/expo_push_notification");
const { User } = require("../models/user");
const { Detail } = require("../models/detail");
const moment = require("moment");
const paypal = require("paypal-rest-sdk");
const querystring = require("querystring");
paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id:
    "AQX9hsvb0pVOWHJIyPoJkFQmCIrRvilCEL-E21debqETRa8Du5xkcb_ETqE9LZEM_gJYZWAWqXwcxgOX",
  client_secret:
    "EOOQ4e82NxF2d_UJtVgw-WYR7KXyquS-8tGno80Wxezgcoa9k_DUdw9b1TQYluMttvDHG_o-yxOcZdLN"
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
    var transactionsData = [
      {
        item_list: {
          items: [
            {
              name: "item",
              sku: "item",
              price: "1.00",
              currency: "INR",
              quantity: 1
            }
          ]
        },
        amount: {
          currency: "INR",
          total: "1.00"
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
          `http://localhost:5000/api/txn/paypal/status?statusPath=success&transactionsData=${JSON.stringify(
            transactionsData
          )}`
        ),
        cancel_url: encodeURI(
          `http://localhost:5000/api/txn/paypal/status?statusPath=failed&transactionsData=${JSON.stringify(
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
        res.redirect(payment.links[1].href);
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
