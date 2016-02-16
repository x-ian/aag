var mongoose = require('mongoose');

var salesDocumentSchema = new mongoose.Schema({
  buyNowAmount: Number,
  auctionStartAmount: Number,
  auctionIncrement: Number,
  auctionExpectedAmount: Number,
  status: { type: String, enum: ['PRIVATE', 'PUBLISHED', 'SOLD_BUY_NOW', 'SOLD_AUCTION'] },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle'
  }
});

module.exports = mongoose.model('SalesDocument', salesDocumentSchema);
