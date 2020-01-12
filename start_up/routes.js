const authRoute = require("../routes/auth");
const meRoute = require("../routes/me");
const generalRoute = require("../routes/general");
const txnRoute = require("../routes/txn");
const adminRoute = require("../routes/admin");
module.exports = function routes(app) {
  app.use("/api/auth", authRoute);
  app.use("/api/me", meRoute);
  app.use("/api/general", generalRoute);
  app.use("/api/txn", txnRoute);
  app.use("/api/admin", adminRoute);
  console.log("Routes Added");
};
