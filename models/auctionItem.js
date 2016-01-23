var mongoose = require('mongoose');

var auctionItemSchema = new mongoose.Schema({
  startAmount: Number,
  incrementBy: Number,
  startTimestamp: Date,
  endTimestamp: Date,
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
