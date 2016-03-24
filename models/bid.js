var mongoose = require('mongoose');

var bidSchema = new mongoose.Schema({
  amount: Number,
  timestamp: Date,
  // sequenceNumber: Number,
  sequenceNumberBase: Number,
  status: { type: String, enum: ['PENDING', 'REJECTED_OUTDATED', 'ACCEPTED', 'REJECTED', 'REJECTED_SERVER_BUSY','WON', 'REJECTED_INVALID'] },
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
