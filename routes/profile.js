const Router = require("express").Router();
const Post = require("../models/Post");
const verify = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/auth/login");
    next();
  }
};

Router.get("/", verify, async (req, res) => {
  const post = await Post.find({});

  res.render("profile", { user: req.user, post });
});

// new Post
Router.get("/post", verify, (req, res) => {
  res.render("post", { user: req.user });
});

Router.post("/post", verify, (req, res) => {
  console.log(req.user);
  const { title, content, edge } = req.body;
  function hide() {
    {
      if (edge == "on") {
        return "匿名";
      } else {
        return req.user.name;
      }
    }
  }

  let newPost = new Post({ title, content, author: hide() });
  try {
    newPost.save().then((post) => {
      req.flash("success_msg", "留言成功~");
      res.redirect("/profile/post");
    });
  } catch (err) {
    req.flash("error_msg", err.errors.message);
    res.redirect("/profile/post");
  }
});

module.exports = Router;
