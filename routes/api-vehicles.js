var Vehicle = require('../models/vehicle');

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
    Vehicle.create(req.body, function (err, item) {
      if (err || !item) return next(err);
      // return res.json(item);
      return res.json({ message: 'Item added' });
    });
  });

}
