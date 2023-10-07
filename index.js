const express = require("express");
const app = express();
const ejs = require("ejs");
const flash = require("connect-flash");
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const authRoute = require("./routes/auth");
const profileRoute = require("./routes/profile");
require("./authenticate/passport");
const session = require("express-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const Post = require("./models/Post");

// Post.deleteMany({}).then(() => {});
// middleware
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
// app.use(flash());
// app.use(flash());

// const flash = require("connect-flash");
// User.deleteMany({}).then(() => {});
// async function find_() {
//   const user = await User.find({});
//   console.log(user);
// }

// find_();
// cookie session
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: false,
  })
);

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});
// app.use((req, res, next) => {
//   res.locals.success_msg = req.flash("success_msg");
//   res.locals.error_msg = req.flash("error_msg");
//   res.locals.error = req.flash("error");
//   next();
// });

app.use(passport.initialize());
app.use(passport.session());

// routes
app.use("/auth", authRoute);
app.use("/profile", profileRoute);

// db

mongoose
  .connect(process.env.MONGOOSE_INFO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connect db ok");
  })
  .catch((err) => {
    console.log(err);
    res.send(err);
  });

app.get("/", (req, res) => {
  res.render("index", { user: req.user });
});

app.listen(8051, () => {
  console.log("The server is running");
});
