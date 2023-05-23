const busboyBodyParser = require("busboy-body-parser");
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");


const app = express();
const viewsDir = path.join(__dirname, "views");
app.engine("mst", mustache(path.join(viewsDir, "partials")));
app.set("views", viewsDir);
app.set("view engine", "mst");


app.use(express.static("public"));
app.use(express.static("data/fs"));
app.use(busboyBodyParser());
app.use(busboyBodyParser({ limit: "35mb", multi: true }));
app.use(cookieParser());
app.use(
  session({
    secret: config.secret, 
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
module.exports = app;
