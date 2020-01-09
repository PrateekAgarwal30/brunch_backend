const express = require("express");
const auth = require("./middleware/auth");
const cors = require("cors");
const engines = require("consolidate");
const bodyParser = require("body-parser");

const app = express();

app.engine("ejs", engines.ejs);
app.set("views", "./views");
app.set("view engine", "ejs");

app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use("/public", express.static("public"));
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
// app.use(logger({ path: "logfile.log" }));
require("./start_up/db")();

const config = require("config");
if (!config.get("jwtPrivateKey")) {
  console.log(
    "jwtPrivateKey environment varaible is not set \n set brunch_jwtPrivateKey=12345 in cmd"
  );
  process.exit(1);
}

app.get("/", auth, (req, res) => {
  res.status(200).send({
    _status: "success",
    _message: "Connected Successfully"
  });
});

require("./start_up/routes")(app);

app.set("port", process.env.PORT || 5000);
app.listen(app.get("port"), function() {
  console.log("Node server is running on port " + app.get("port"));
});
