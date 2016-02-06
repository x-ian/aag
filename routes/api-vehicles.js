var Vehicle = require('../models/vehicle');
var AuctionItem = require('../models/auctionitem');
var SalesDocument = require('../models/salesdocument');
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
    brand: reqBody['vehicle[brand]'],
    classification: reqBody['vehicle[classification]'],
    model: reqBody['vehicle[model]'],
    transmission: reqBody['vehicle[transmission]'],
    fuelType: reqBody['vehicle[fuelType]'],
    powerOutputPs: reqBody['vehicle[powerOutputPs]'],
    cubicCapacityCcm: reqBody['vehicle[cubicCapacityCcm]'],
    registrationDate: reqBody['vehicle[registrationDate]'],
    odometerKm: reqBody['vehicle[odometerKm]'],
    features: reqBody['vehicle[features]'],
    damages: reqBody['vehicle[damages]'],
  };
  if (withId) o._id = reqBody['vehicle[_id]'];
  if (withImages) o.images = reqBody['vehicle[images]'];

  return o;
}

function mapSalesDocumentReqBody(reqBody, withId, vehicleId) {
  var o = {
    buyNowAmount: reqBody['salesDocument[buyNowAmount]'],
    auctionStartAmount: reqBody['salesDocument[auctionStartAmount]'],
    auctionIncrement: reqBody['salesDocument[auctionIncrement]'],
    auctionExpectedAmount: reqBody['salesDocument[auctionExpectedAmount]'],
    //status
    vehicle: vehicleId
  };
  if (withId) o._id = reqBody['salesDocument[_id]'];
  return o;
}

module.exports = function (app) {

  /**
   * GET all vehicles
   */
  app.get('/api/vehicles', function(req, res, next) {
    Vehicle.find(function(err, item) {
      if (err || !item) return next(err);
      // return res.send(item);
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
   * DELETE one vehicle
   */
  app.delete('/api/vehicles/:id', function(req,res,next) {
    Vehicle.findByIdAndRemove(req.params.id, function (err, item){
      if (err || !item) return next(err);
      // return res.json(item);
      return res.json({ message: 'Item deleted' });
    });
  });

  /**
   * PUT update existing vehicle
   */
  app.put('/api/vehicles/:id', function(req, res, next) { 
    Vehicle.findByIdAndUpdate(req.params.id, req.body, function(err, item) {
      if (err || !item) return next(err);
      //return res.json(item);
      return res.json({ message: 'Item updated' });
    });
  });

  /**
   * POST new vehicle
   */
  app.post('/api/vehicles', function(req, res, next) {
    delete req.body._id;
    Vehicle.create(req.body, function (err, item) {
      if (err || !item) return next(err);
      // return res.json(item);
      return res.json({ message: 'Item added' });
    });
  });

  // ---------------------------------------------------------------------------

  app.delete('/api/vehiclesfull/:id', function(req,res,next) {
    var vehicleId = req.params.id;
    SalesDocument.find({vehicle: vehicleId}, function(err, sds) {
      if (err) return next(err);
      sds.forEach(function(sd, index, array) {
        AuctionItem.findById(sd.auctionItem, function(err, ais) {
          var ids = ais.map(function(ai) { return ai._id; });

          // bids
          Bid.find({auctionItem: {$in: ids}}).remove().exec();
        });

        // auctionitems
        AuctionItem.findById(sd.auctionItem).remove().exec();

        // sales document
        sd.remove();
      });
    });

    // vehicle
    Vehicle.findById(req.params.id).remove().exec();

    // images
    rmdir(vehicleImagePath + '/' + req.params.id, function(error){});

    return res.json({ message: 'Item(s) deleted' });
  });

  app.get('/api/vehiclesfull/:id', function(req, res, next) { 
    Vehicle.findById(req.params.id, function(err, item) {
      if (err || !item) return next(err);
      SalesDocument.findOne({'vehicle': req.params.id}, function(err2, item2) {
        if (err2) return next(err2);
        if (!item2) return res.json({vehicle: item});
        return res.json({vehicle: item, salesDocument: item2});
      });
    });
  });

  app.put('/api/vehiclesfull/:id', function(req, res, next) { 
    var vehicleId = req.params.id;
    var salesDocumentId = req.body['salesDocument[_id]'];
    if (salesDocumentId) {
      SalesDocument.findByIdAndUpdate(salesDocumentId, mapSalesDocumentReqBody(req.body, false, vehicleId)).exec();
    } else {
      SalesDocument.create(mapSalesDocumentReqBody(req.body, false, vehicleId), function(err, item) {
        if (err || !item) return next(err);
      });
    }
    Vehicle.findByIdAndUpdate(req.params.id, mapVehicleReqBody(req.body, false, false), function(err, item) {
      if (err || !item) return next(err);
      return res.json({ message: 'Item updated' });
    });
  });

  app.post('/api/vehiclesfull', function(req, res, next) { 
    Vehicle.create(mapVehicleReqBody(req.body, false, false), function (err, item) {
      if (err || !item) return next(err);
      SalesDocument.create(mapSalesDocumentReqBody(req.body, false, item._id));
      return res.json({ message: 'Item added' });
    });
  });

  app.post('/api/vehiclesfull/:id/addimages', function(req, res, next) { 
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


}
