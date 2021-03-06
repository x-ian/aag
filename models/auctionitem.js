var mongoose = require('mongoose');

var auctionItemSchema = new mongoose.Schema({
  startAmount: Number,
  incrementBy: Number,
  expectedAmount: Number,
  startTimestamp: Date,
  endTimestamp: Date,
  nextExpectedBidAmount: Number,
  // unsure if this belongs here, could be removed cause of recentAcceptedBid
  recentAcceptedBidAmount: Number,
  recentAcceptedBidSequenceNumber: Number,
  recentAcceptedBid: {
     type: mongoose.Schema.Types.ObjectId,
     ref: 'Bid'
  },
  // used for poor mans queue
  processingBid: { type: Boolean, default: false },
  status: { type: String, enum: ['NOT_SCHEDULED', 'NOT_OPEN', 'NO_BIDS_YET', 'WAITING_FOR_BIDS',
    'INCOMING_BID', 'WAITING_FINAL_CALL',
    'SOLD', 'WAITING_FINAL_CALL_EMPTY', 'CLOSED_EMPTY']
  },
  vehicle: {
     type: mongoose.Schema.Types.ObjectId,
     ref: 'Vehicle'
   },
  auction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auction'
  }
});

module.exports = mongoose.model('AuctionItem', auctionItemSchema);
