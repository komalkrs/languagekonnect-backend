// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: String,
  name: String,
  credits: { type: Number, default: 0 },
  // add other fields as per your project
});

module.exports = mongoose.model('User', userSchema);
