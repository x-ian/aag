var mongoose = require('mongoose');

var auctionItemSchema = new mongoose.Schema({
  startAmount: Number,
  incrementBy: Number,
  startTimestamp: Date,
  endTimestamp: Date,
  status: { type: String, enum: ['NOT_OPEN', 'NO_BIDS_YET', 'WAITING_FOR_BIDS',
    'INCOMING_BID', 'BID_ACCEPTED', 'BID_REJECTED', 'WAITING_FINAL_CALL', 
    'SOLD', 'WAITING_FINAL_CALL_EMPTY', 'CLOSED_EMPTY']
  },
  vehicle: {
     type: mongoose.Schema.Types.ObjectId,
     ref: 'Vehicle'
   },
  auction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auction'
  },
  // optimization shortcut
  highestBid: {
     type: mongoose.Schema.Types.ObjectId,
     ref: 'Bid'
   }
});

module.exports = mongoose.model('AuctionItem', auctionItemSchema);
