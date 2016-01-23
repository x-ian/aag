var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  name: String,
  email: String,
  createdAt: Date,
  closedAt: Date,
  isSeller: Boolean,
  isBuyer: Boolean
});

module.exports = mongoose.model('User', userSchema);
