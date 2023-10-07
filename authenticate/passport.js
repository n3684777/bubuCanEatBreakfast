const passport = require("passport");
const facebookStrategy = require("passport-facebook");
const localStrategy = require("passport-local");
const googleStrategy = require("passport-google-oauth20");
const bcrypt = require("bcrypt");
const User = require("../models/User");

// User.deleteMany({}).then(() => {});

// serializeUser
passport.serializeUser((user, cb) => {
  console.log("serialize User now");
  cb(null, user._id);
});

// deserializeUser
passport.deserializeUser((_id, cb) => {
  console.log("deserialized User now");
  User.findById({ _id }).then((user) => {
    console.log("found User!");
    cb(null, user);
  });
});
// fb strategy
passport.use(
  new facebookStrategy(
    {
      clientID: process.env.FB_ID,
      clientSecret: process.env.FB_SECRET,
      callbackURL: "http://localhost:8051/auth/facebook/redirect",
      profileFields: [
        "email",
        "displayName",
        "id",
        "link",
        "photos",
        "birthday",
      ],
    },
    async (accessToken, refreshToken, profile, cb) => {
      console.log(profile);
      const foundUser = await User.findOne({ facebookID: profile.id });
      if (foundUser) {
        console.log("The User already exist");
        cb(null, foundUser);
      } else {
        const newUser = new User({
          name: profile.displayName,
          facebookID: profile.id,
          img: profile.photos[0].value,
          email: profile.emails[0].value,
          birthday: profile._json.birthday,
        });
        try {
          newUser.save().then((user) => {
            console.log("saved fb user ok");
            cb(null, user);
          });
        } catch (err) {
          console.log(err);
          cb(null, err);
        }
      }
    }
  )
);

// google strategy

passport.use(
  new googleStrategy(
    {
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: "/auth/google/redirect",
    },
    async (accessToken, refreshToken, profile, cb) => {
      console.log(profile);
      const foundUser = await User.findOne({ googleID: profile.id });
      if (foundUser) {
        console.log("The User already exist");
        cb(null, foundUser);
      } else {
        const newUser = new User({
          googleID: profile.id,
          name: profile.displayName,
          img: profile.photos[0].value,
          email: profile.emails[0].value,
        });
        try {
          newUser.save().then((user) => {
            console.log("saved User ok");
            cb(null, user);
          });
        } catch (err) {
          console.log("saved User error");
          cb(null, err);
        }
      }
    }
  )
);

// local strategy
passport.use(
  new localStrategy(async (username, password, cb) => {
    const foundUser = await User.findOne({ email: username });
    if (foundUser) {
      bcrypt.compare(password, foundUser.password, (err, result) => {
        console.log(result);
        if (result) {
          cb(null, foundUser);
        } else {
          cb(null, false);
        }
      });
    } else {
      cb(null, false);
    }
  })
);
