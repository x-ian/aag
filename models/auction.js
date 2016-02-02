var mongoose = require('mongoose');

var auctionSchema = new mongoose.Schema({
  scheduledAt: Date,
  closedAt: Date,
  location: String,
  active: { type: Boolean, default: false }
});

module.exports = mongoose.model('Auction', auctionSchema);
