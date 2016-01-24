var mongoose = require('mongoose');

var bidSchema = new mongoose.Schema({
  amount: Number,
  timestamp: Date,
  sequenceNumber: Number,
  status: String,
  auctionItem: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'AuctionItem'
  },
  bidder: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'User'
  },
  bidderIpAddress: String
});

module.exports = mongoose.model('Bid', bidSchema);
