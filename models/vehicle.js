var mongoose = require('mongoose');

var vehicleSchema = new mongoose.Schema({
  title: String,
  description: String,
  seller: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'User'
  },
  // modelData
  brand: String,
  classification: String,
  model: String,
  transmission: String,
  fuelType: String,
  powerOutputPs: Number,
  cubicCapacityCcm: Number,
  // vehicleData
  registrationDate: String,
  odometerKm: Number,
  features: String,
  damages: String,
  images: [ {original: String, thumbnail: String} ],
  // salesData
  buyNowAmount: Number,
  auctionStartAmount: Number,
  auctionIncrement: Number,
  auctionExpectedAmount: Number,
  status: { type: String, enum: ['DRAFT', 'PUBLISHED', 'IN_AUCTION', 'SOLD_BUY_NOW', 'SOLD_AUCTION', 'SOLD_AUCTION_PENDING_APPROVAL'] },
  sellDate: Date,
  finalSellAmount: Number,
  buyer: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'User'
  }
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
