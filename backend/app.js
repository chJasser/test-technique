const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const authRouter = require('./routes/auth');
const taskRouter = require('./routes/task');
const passport = require("passport");

require("./middleware/passportAuth")

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize())



// routes


app.use('/auth', authRouter);
app.use('/task', taskRouter);




// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  console.log(err.message);
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

//database configuration

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.ATLAS_URI, {
    useNewUrlParser: true,
  })
  .then(() => console.log("MongoDB successfully connected"))
  .catch((err) => console.log(err));


  

module.exports = app;
