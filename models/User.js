const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String },
  name: { type: String, required: true },
  googleID: { type: String },
  facebookID: { type: String },
  img: { type: String },
  date: { type: Date, default: Date.now },
  birthday: { type: Date },
  // local login
  username: { type: String },
  password: { type: String, maxLength: 1024 },
});

module.exports = mongoose.model("User", UserSchema);
