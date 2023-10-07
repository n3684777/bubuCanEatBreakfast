const Router = require("express").Router();
const passport = require("passport");
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");
const { redirect } = require("statuses");
Router.get("/login", (req, res) => {
  res.render("login", { user: req.user });
});

// fb login
Router.get("/facebook", passport.authenticate("facebook"));

Router.get(
  "/facebook/redirect",
  passport.authenticate("facebook"),
  (req, res) => {
    res.render("profile", { user: req.user });
  }
);
// google login

Router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

Router.get(
  "/google/redirect",
  passport.authenticate("google"),
  async (req, res) => {
    const post = await Post.find({});
    res.render("profile", { user: req.user, post });
  }
);

// local login
Router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/auth/login",
    failureFlash: "輸入錯誤",
  }),
  async (req, res) => {
    const post = await Post.find({});
    console.log(req.user);
    res.render("profile", { user: req.user, post });
  }
);

Router.get("/signup", (req, res) => {
  res.render("signup", { user: req.user });
});

Router.get("/signup", (req, res) => {
  res.render("signup");
});

Router.post("/signup", async (req, res) => {
  console.log(req.body);
  let { username, email, password } = req.body;
  let foundUser = await User.findOne({ email });
  if (foundUser) {
    req.flash("error_msg", "The email already exist!");
    res.redirect("/auth/signup");
  } else {
    let hash = await bcrypt.hash(password, 10);

    let newUser = new User({ name: username, email, password: hash });
    try {
      await newUser.save().then((user) => {
        req.flash("success_msg", "註冊成功!");
        res.redirect("/auth/login");
      });
    } catch (err) {
      req.flash("error_msg", err.errors.message);
      res.redirect("/auth/signup");
    }
  }
});

// logout
Router.get("/logout", (req, res) => {
  req.logOut(() => {});
  res.redirect("/");
});
module.exports = Router;
