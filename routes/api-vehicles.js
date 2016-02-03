var Vehicle = require('../models/vehicle');
var AuctionItem = require('../models/auctionitem');
var Bid = require('../models/bid');

function mapVehicleReqBody(reqBody, withId) {
  var o = {
    title: reqBody['vehicle[title]'],
    description: reqBody['vehicle[description]']
  };
  if (withId) o._id = reqBody['vehicle[_id]'];
  return o;
}

function mapAuctionItemReqBody(reqBody, withId, vehicleId) {
  var o = {
    startAmount: reqBody['auctionItem[startAmount]'],
    incrementBy: reqBody['auctionItem[incrementBy]'],
    vehicle: vehicleId
  };
  if (withId) o._id = reqBody['auctionItem[_id]'];
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
    AuctionItem.find({vehicle: req.params.id}, function(err, ais) {
      if (ais) {
        var ids = ais.map(function(ai) { return ai._id; });
        Bid.find({auctionItem: {$in: ids}}).remove().exec();
      }
      AuctionItem.find({vehicle: req.params.id}).remove().exec();
      Vehicle.findById(req.params.id).remove().exec();
    });
    return res.json({ message: 'Item(s) deleted' });
  });

  app.get('/api/vehiclesfull/:id', function(req, res, next) { 
    Vehicle.findById(req.params.id, function(err, item) {
      if (err || !item) return next(err);
      AuctionItem.findOne({'vehicle': req.params.id}, function(err2, item2) {
        if (err2) return next(err2);
        if (!item2) return res.json({vehicle: item});
        return res.json({vehicle: item, auctionItem: item2});
      });
    });
  });

  app.put('/api/vehiclesfull/:id', function(req, res, next) { 
    var vehicleId = req.params.id;
    var auctionItemId = req.body['auctionItem[_id]'];
    if (auctionItemId) {
      AuctionItem.findByIdAndUpdate(auctionItemId, mapAuctionItemReqBody(req.body, false, vehicleId)).exec();
    } else {
      AuctionItem.create(mapAuctionItemReqBody(req.body, false, vehicleId));
    }
    Vehicle.findByIdAndUpdate(req.params.id, mapVehicleReqBody(req.body, false), function(err, item) {
      if (err || !item) return next(err);
      return res.json({ message: 'Item updated' });
    });
  });

  app.post('/api/vehiclesfull', function(req, res, next) { 
    Vehicle.create(mapVehicleReqBody(req.body, false), function (err, item) {
      if (err || !item) return next(err);
      AuctionItem.create(mapAuctionItemReqBody(req.body, false, item._id));
      return res.json({ message: 'Item added' });
    });
  });


}
