const _ = require('lodash');
const moment = require('moment');
const getStatardPaymentMode = (x) => {
    let paymentMode = '';
    switch (x) {
        case 'PPI':
        case 'wallet':
            paymentMode = 'WALLET'
            break;
        case "NB":
        case "netbanking":
            paymentMode = 'NETBANKING'
            break;
        case "upi":
            paymentMode = 'UPI'
            break;
        case "CC":
            paymentMode = 'CREDITCARD'
            break;
        case "DC":
            paymentMode = 'DEBITCARD'
            break;
        default:
            break;
    }
    return paymentMode;
}
const paytmTxnParser = (txnData) => {
    const data = {
        "gatewayMode":"Paytm",
        "transactionAmount": + txnData["TXNAMOUNT"],
        "currency": txnData["CURRENCY"],
        "orderId": txnData["ORDERID"],
        "paymentMode": getStatardPaymentMode(txnData["PAYMENTMODE"]),
        "transactionDate": moment(txnData["TXNDATE"]).subtract(330,'minutes').format(),
        "bank": txnData["BANKNAME"] === 'WALLET'
            ? undefined
            : txnData["BANKNAME"],
        "bankTxnId": txnData["BANKTXNID"],
        "gatewayTxnId": txnData["TXNID"],
        "wallet": txnData["BANKNAME"] === 'WALLET'
            ? "paytm"
            : undefined,
        "vpa": txnData[""]
    }
    return data;
}

const razorPayTxnParser = (txnData) => {
    const data = {
        "gatewayMode":"Razorpay",
        "transactionAmount": txnData["amount"] / 100,
        "currency": txnData["currency"],
        "orderId": txnData["order_id"],
        "paymentMode": getStatardPaymentMode(txnData["method"]),
        "bank": txnData["bank"],
        "wallet": txnData["wallet"],
        "vpa": txnData["vpa"],
        "transactionDate": moment(+ txnData["created_at"] * 1000).format(),
        "bankTxnId": txnData["BANKTXNID"],
        "gatewayTxnId": txnData["id"]
    }
    return data;
}

// console.log(razorPayTxnParser({
//     amount: 10050,
//     amount_refunded: 0,
//     bank: null,
//     captured: true,
//     card_id: null,
//     contact: "+918186881920",
//     created_at: 1582406892,
//     currency: "INR",
//     description: "A Wild Sheep Chase is the third novel by Japanese author  Haruki Murakami",
//     email: "p2@gmail.com",
//     entity: "payment",
//     error_code: null,
//     error_description: null,
//     fee: 236,
//     id: "pay_EJw9wfZggwDBWA",
//     international: false,
//     invoice_id: null,
//     method: "wallet",
//     order_id: "order_EJw9kWxXLkRHj8",
//     refund_status: null,
//     status: "captured",
//     tax: 36,
//     vpa: null,
//     wallet: "freecharge"
// }));
// console.log(paytmTxnParser({
//     BANKNAME: "HDFC",
//     BANKTXNID: "10727539980",
//     CHECKSUMHASH: "ucfErBDgP2y/HQfvBOFvDYExcPjML4tTvRGXRfA1oZdrOAS8+CkSdiFnz7ewphXVFvNCYxXLbqcZgK5L" +
//             "VxhVQrtI9W9Ibk47xsaP7zOEEbg=",
//     CURRENCY: "INR",
//     GATEWAYNAME: "HDFC",
//     MID: "NDOwFX37840609770206",
//     ORDERID: "1582406168648",
//     PAYMENTMODE: "NB",
//     RESPCODE: "01",
//     RESPMSG: "Txn Success",
//     STATUS: "TXN_SUCCESS",
//     TXNAMOUNT: "100.50",
//     TXNDATE: "2020-02-23 02:46:10.0",
//     TXNID: "2020022311121280011016879910130"
// }));

// console.log(paytmTxnParser({
//     BANKNAME: "WALLET",
//     BANKTXNID: "48117924",
//     CHECKSUMHASH: "7XSg7Y4K4YnxvNNyPXlOC4sVgr7Uut9QcpL15efCdShJY81BNYzq6FJejrv+Pf2bQfhhEMglU15/ri9B" +
//             "Y2f23IjibqIcq2nSuKh5PiUQgaE=",
//     CURRENCY: "INR",
//     GATEWAYNAME: "WALLET",
//     MID: "NDOwFX37840609770206",
//     ORDERID: "1582406598021",
//     PAYMENTMODE: "PPI",
//     RESPCODE: "01",
//     RESPMSG: "Txn Success",
//     STATUS: "TXN_SUCCESS",
//     TXNAMOUNT: "100.00",
//     TXNDATE: "2020-02-23 02:53:19.0",
//     TXNID: "20200223111212800110168110701"
// }));

// console.log(paytmTxnParser({
//     BANKNAME: "JPMORGAN CHASE BANK",
//     BANKTXNID: "777001135245364",
//     CHECKSUMHASH: "Vqu4QGWh/KzNNS4bWWZ4/FNhS+Mls4ZaSc3L9jLbvGWyAUjc+NA54oGUyOzBigh7QIIjKk+0SnlRJ26k" +
//             "d8m8wS1iEJDHvgDvTwT8ghpF83M=",
//     CURRENCY: "INR",
//     GATEWAYNAME: "HDFC",
//     MID: "NDOwFX37840609770206",
//     ORDERID: "1582406680954",
//     PAYMENTMODE: "DC",
//     RESPCODE: "01",
//     RESPMSG: "Txn Success",
//     STATUS: "TXN_SUCCESS",
//     TXNAMOUNT: "100.00",
//     TXNDATE: "2020-02-23 02:54:42.0",
//     TXNID: "202002231112128001101683070013"
// }));

// console.log(paytmTxnParser({
//     BANKNAME: "ICICI Bank",
//     BANKTXNID: "777001600992275",
//     CHECKSUMHASH: "ztAjRTacVy5dlpOIGhPWPiSC1yDpbbcaVIyR+RMw3nirak0ZDDBWCuojHacP2dIgFp/+pgBriK0wXhvK" +
//             "FiYbGWkZUVcrwmEu7EfunYygZUA=",
//     CURRENCY: "INR",
//     GATEWAYNAME: "HDFC",
//     MID: "NDOwFX37840609770206",
//     ORDERID: "1582406754603",
//     PAYMENTMODE: "CC",
//     RESPCODE: "01",
//     RESPMSG: "Txn Success",
//     STATUS: "TXN_SUCCESS",
//     TXNAMOUNT: "100.00",
//     TXNDATE: "2020-02-23 02:55:55.0",
//     TXNID: "202002231112128001"
// }));

module.exports = {
    paytmTxnParser,
    razorPayTxnParser
}