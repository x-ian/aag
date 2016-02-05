var mongoose = require('mongoose');

var vehicleSchema = new mongoose.Schema({
  title: String,
  description: String,
  brand: String,
  classification: String,
  model: String,
  // modelData: {
    gear: String,
    fuelType: String,
    powerOutputPs: Number,
    cubicCapacity: Number,
  // },
  // vehicleData: {
    registrationDate: String,
    odometerKm: Number,
  // },
  features: String,
  damages: String,
  images: []
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
