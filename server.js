const express = require("express");
const mongoose = require("mongoose")
const path = require("path");


let PORT = process.env.PORT || 3000;
let app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "public")));

const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoNews";

mongoose.connect(MONGODB_URI);

require("./routes/apiRoutes")(app);

app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});