var mongoose = require('mongoose');

var vehicleSchema = new mongoose.Schema({
  title: String,
  description: String,
  classification: String,
  vehicleData: {
    registrationDate: String,
    condition: String,
    numberPreviousOwners: Number,
    hu: String,
    schadstoffklasse: String,
    umweltplakette: String
  },
  //features: [{ feature: String }],
  pictures: String,
  damages: String
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
