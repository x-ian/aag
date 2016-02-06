var mongoose = require('mongoose');

var auctionSchema = new mongoose.Schema({
  scheduledAt: Date,
  closedAt: Date,
  location: String,
  active: { type: Boolean, default: false },
  currentAuctionItem: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'AuctionItem'
  },
});

module.exports = mongoose.model('Auction', auctionSchema);
