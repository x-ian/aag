var mongoose = require('mongoose');

var bidSchema = new mongoose.Schema({
  amount: Number,
  timestamp: Date,
  sequenceNumber: Number,
  sequenceNumberBase: Number,
  status: { type: String, enum: ['PENDING', 'TOO_LATE', 'ACCEPTED', 'REJECTED', 'WON'] },
  auctionItem: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'AuctionItem'
  },
  user: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'User'
  },
  userIpAddress: String
});

module.exports = mongoose.model('Bid', bidSchema);
