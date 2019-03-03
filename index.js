const express = require('express');
const auth = require("./middleware/auth");
const app = express();
const logger = require('express-logger');
app.use(express.json());
app.use(logger({ path: "logfile.log" }));
require('./start_up/db')();
const config = require("config");
if (!config.get("jwtPrivateKey")) {
    console.log("jwtPrivateKey environment varaible is not set");
    //set brunch_jwtPrivateKey=12345 in cmd
    process.exit(1);
}
app.get('/', auth, (req, res) => {
    res
      .status(200)
      .send({
        _status: "success",
        _message: "Connected Successfully"
      });
});
require("./start_up/routes")(app);
const port = process.env.port || 3500;
app.listen(port, () => {
    console.log(`Listening at Port : ${port}`);
})