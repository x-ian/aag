var mongoose = require('mongoose');

var auctionSchema = new mongoose.Schema({
  openAt: Date,
  closeAt: Date,
  location: String
});

module.exports = mongoose.model('Auction', auctionSchema);
