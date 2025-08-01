
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: String,
  name: String,
  credits: { type: Number, default: 0 },
  
});

module.exports = mongoose.model('User', userSchema);
