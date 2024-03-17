var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
const mongoose = require("mongoose");

// Routes
var apiRouter = require("./routes/api");
const userRouter = require("./routes/user");
const loginRouter = require("./routes/login");
const conversationRouter = require("./routes/conversation");

var app = express();

async function main() {
  try {
    console.log("trying connection to db");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("should be connected to db");
  } catch (err) {
    return next(err);
  }
}
main();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", apiRouter);
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);
// app.use("/api/conversation", conversationRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
