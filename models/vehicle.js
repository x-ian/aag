var mongoose = require('mongoose');

var vehicleSchema = new mongoose.Schema({
  title: String,
  description: String,
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
  status: { type: String, enum: ['DRAFT', 'PUBLISHED', 'IN_AUCTION', 'SOLD_BUY_NOW', 'SOLD_AUCTION'] }
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
