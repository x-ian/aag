var auth = require('../lib/auth');
var log = require('../lib/log');

var Vehicle = require('../models/vehicle');
var SalesInformation = require('../models/vehicle');
var AuctionItem = require('../models/auctionitem');
var Bid = require('../models/bid');
var multiparty = require('multiparty');
var fs = require('fs');
var rmdir = require('rimraf');

const vehicleImagePathLocal = '/Users/xian/projects/auto-auction-germany.com/aag/public/';
const vehicleImagePathPublic = '/vehicles/';
const vehicleImagePath = vehicleImagePathLocal + vehicleImagePathPublic;

function mapVehicleReqBody(reqBody, withId, withImages) {
  var o = {
    title: reqBody['vehicle[title]'],
    description: reqBody['vehicle[description]'],
    seller: reqBody['vehicle[seller]'],
    // modelData
    brand: reqBody['vehicle[brand]'],
    classification: reqBody['vehicle[classification]'],
    model: reqBody['vehicle[model]'],
    transmission: reqBody['vehicle[transmission]'],
    fuelType: reqBody['vehicle[fuelType]'],
    powerOutputPs: reqBody['vehicle[powerOutputPs]'],
    cubicCapacityCcm: reqBody['vehicle[cubicCapacityCcm]'],
    // vehicleData
    registrationDate: reqBody['vehicle[registrationDate]'],
    odometerKm: reqBody['vehicle[odometerKm]'],
    features: reqBody['vehicle[features]'],
    damages: reqBody['vehicle[damages]'],
    // salesData
    buyNowAmount: reqBody['vehicle[buyNowAmount]'],
    auctionStartAmount: reqBody['vehicle[auctionStartAmount]'],
    auctionIncrement: reqBody['vehicle[auctionIncrement]'],
    auctionExpectedAmount: reqBody['vehicle[auctionExpectedAmount]'],
    status: reqBody['vehicle[status]']
  };
  if (withId) o._id = reqBody['vehicle[_id]'];
  if (withImages) o.images = reqBody['vehicle[images]'];

  return o;
}

module.exports = function (app) {

  /**
   * GET all vehicles
   */
  app.get('/api/vehicles', function(req, res, next) {
    Vehicle.find(function(err, item) {
      if (err || !item) return next(err);
      return res.json(item);
    });
  });

  /**
   * GET one vehicle
   */
  app.get('/api/vehicles/:id', function(req, res, next) { 
    Vehicle.findById(req.params.id, function(err, item) {
      if (err || !item) return next(err);
      return res.json(item);
    });
  });

  /**
   * GET one vehicle
   */
  app.get('/api/vehiclesonlythumbnails/:id', function(req, res, next) { 
    Vehicle.findById(req.params.id, function(err, item) {
      if (err || !item) return next(err);
      item.images.forEach((image)=> {
        image.original = null;
      });
      return res.json(item);
    });
  });

  /**
   * DELETE one vehicle
   */
  app.delete('/api/vehicles/:id', auth.isLoggedInUser, function(req,res,next) {
    Vehicle.findByIdAndRemove(req.params.id, function (err, item){
      if (err || !item) return next(err);
      // return res.json(item);
      return res.json({ message: 'Item deleted' });
    });
  });

  /**
   * PUT update existing vehicle
   */
  app.put('/api/vehicles/:id', auth.isLoggedInUser, function(req, res, next) { 
    Vehicle.findByIdAndUpdate(req.params.id, req.body, {new: true}, function(err, item) {
      if (err || !item) return next(err);
      item.seller = req.user._id;
      item.save();
      return res.json(item);
      // return res.json({ message: 'Item updated' });
    });
  });

  /**
   * POST new vehicle
   */
  app.post('/api/vehicles', auth.isLoggedInUser, function(req, res, next) {
    delete req.body._id;
    Vehicle.create(req.body, function (err, item) {
      if (err || !item) return next(err);
      item.seller = req.user._id;
      item.save();
      return res.json({ message: 'Item added' });
    });
  });

  // ---------------------------------------------------------------------------

  app.delete('/api/vehiclesfull/:id', auth.isLoggedInUser, function(req,res,next) {
    var vehicleId = req.params.id;

    // auctionitems & bids
    AuctionItem.find({vehicle: vehicleId}, function(err, ais) {
      if (err) return next(err);
      var ids = ais.map(function(ai) { return ai._id; });
      Bid.find({auctionItem: {$in: ids}}).remove().exec();
      ais.forEach(function(ai, index, array) {
        ai.remove();
      });
    });

    // vehicle
    Vehicle.findById(req.params.id).remove().exec();

    // images
    rmdir(vehicleImagePath + '/' + req.params.id, function(error){});

    return res.json({ message: 'Item(s) deleted' });
  });

  app.get('/api/vehiclesfull', function(req, res, next) { 
    Vehicle.find(function(err, item) {
      if (err || !item) return next(err);
      return res.json({vehicle: item});
    });
  });


  app.get('/api/vehiclesfull/:id', function(req, res, next) { 
    Vehicle.findById(req.params.id, function(err, item) {
      if (err || !item) return next(err);
      return res.json({vehicle: item});
    });
  });

  app.put('/api/vehiclesfull/:id', auth.isLoggedInUser, function(req, res, next) { 
    var vehicleId = req.params.id;
    Vehicle.findByIdAndUpdate(req.params.id, mapVehicleReqBody(req.body, false, false), function(err, item) {
      if (err || !item) return next(err);
      return res.json({ message: 'Item updated' });
    });
  });

  app.post('/api/vehiclesfull', auth.isLoggedInUser, function(req, res, next) { 
    Vehicle.create(mapVehicleReqBody(req.body, false, false), function (err, item) {
      if (err || !item) return next(err);
       return res.json({ message: 'Item added' });
    });
  });

  app.post('/api/vehiclesfull/:id/addimages', auth.isLoggedInUser, function(req, res, next) { 
    var vehicleId = req.params.id;

    var form = new multiparty.Form();
    form.parse(req, function (err, fields, files) {
      Object.keys(files).forEach(function(key){
        console.log(files[key]);

        var vehiclePath = vehicleImagePath + vehicleId;
        fs.existsSync(vehiclePath) || fs.mkdirSync(vehiclePath);
        // if (!fs.statSync(vehiclePath)) {
          // fs.mkdirSync(vehiclePath, );
        // }
        var tempPath = files[key][0].path + '';
        var copyToPath = vehiclePath + '/' + files[key][0].originalFilename;
        fs.readFile(tempPath, (err, data) => {
          // make copy of image to new location
          fs.writeFile(copyToPath, data, (err) => {
            var image = {
              thumbnail: vehicleImagePathPublic + vehicleId + '/' + files[key][0].originalFilename,
              original: vehicleImagePathPublic + vehicleId + '/' + files[key][0].originalFilename
            }
            console.log(image);
            // delete temp image
            fs.unlink(tempPath, () => {
              // res.send("Files uploaded to: " + copyToPath);
            });
            Vehicle.findById(req.params.id, function(err, vehicle) {
              if (!vehicle.images) {
                // safety net if vehicle.images is not defined or ''
                vehicle.images = [ image ];
              } else {
                vehicle.images.push(image);
              }
              vehicle.save();
            });

            // Vehicle.findByIdAndUpdate(req.params.id, {$push: {"images": image}}).exec();
          });
        });
      });
    });

    return res.json({message: 'yo'});
  });

  app.get('/api/myvehicles', auth.isLoggedInUser, function(req, res, next) {
    Vehicle.find({seller: req.user._id}, function(err, item) {
      if (err || !item) return next(err);
      return res.json(item);
    });
  });

  app.get('/api/mysales', auth.isLoggedInUser, function(req, res, next) {
    Vehicle.find({seller: req.user._id, status: 'SOLD_AUCTION'}, function(err, item) {
      if (err || !item) return next(err);
      return res.json(item);
    });
  });

  app.get('/api/mypurchases', auth.isLoggedInUser, function(req, res, next) {
    Vehicle.find(
      {
        $and: [
          { buyer: req.user._id },
          { $or: [ { status: 'SOLD_BUY_NOW' }, { status: 'SOLD_AUCTION' } ] }
        ]
      }, function(err, item) {
        if (err || !item) return next(err);
        return res.json(item);
      }
    );
  });

  app.get('/api/availablevehicles', auth.isLoggedInUser, function(req, res, next) {
    Vehicle.find(
      { $or: [ { status: 'PUBLISHED' }, { status: 'IN_AUCTION' } ] }
      , function(err, item) {
        if (err || !item) return next(err);
        return res.json(item);
      }
    );
  });
}
