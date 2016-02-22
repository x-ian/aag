var auth = require('../lib/auth');
var Bid = require('../models/bid');

module.exports = function (app) {

  /**
   * GET all bids
   */
  app.get('/api/bids', auth.isLoggedInUser, function(req, res, next) {
    Bid.find(function(err, item) {
      if (err || !item) return next(err);
      // return res.send(item);
      return res.json(item);
    });
  });

  /**
   * GET one bid
   */
  app.get('/api/bids/:id', auth.isLoggedInUser, function(req, res, next) { 
    Bid.findById(req.params.id, function(err, item) {
      if (err || !item) return next(err);
      return res.json(item);
    });
  });

  /**
   * DELETE one bid
   */
  app.delete('/api/bids/:id', auth.isLoggedInUser, function(req,res,next) {
    Bid.findByIdAndRemove(req.params.id, function (err, item){
      if (err || !item) return next(err);
      // return res.json(item);
      return res.json({ message: 'Item deleted' });
    });
  });

  /**
   * PUT update existing bid
   */
  app.put('/api/bids/:id', auth.isLoggedInUser, function(req, res, next) { 
    Bid.findByIdAndUpdate(req.params.id, req.body, function(err, item) {
      if (err || !item) return next(err);
      //return res.json(item);
      return res.json({ message: 'Item updated' });
    });
  });

  /**
   * POST new bid
   */
  app.post('/api/bids', auth.isLoggedInUser, function(req, res, next) {
    Bid.create(req.body, function (err, item) {
      if (err || !item) return next(err);
      // return res.json(item);
      return res.json({ message: 'Item added' });
    });
  });

}
