var auth = require('../lib/auth');
var AuctionItem = require('../models/auctionitem');

module.exports = function (app) {

  /**
   * GET all auction items
   */
  app.get('/api/auctionitems', function(req, res, next) {
    AuctionItem.find(function(err, item) {
      if (err || !item) return next(err);
      return res.json(item);
    });
  });

  /**
   * GET one auction item
   */
  app.get('/api/auctionitems/:id', function(req, res, next) { 
    AuctionItem.findById(req.params.id, function(err, item) {
      if (err || !item) return next(err);
      return res.json(item);
    });
  });

  /**
   * DELETE one auctionitem
   */
  app.delete('/api/auctionitems/:id', auth.isLoggedInUser, function(req,res,next) {
    AuctionItem.findByIdAndRemove(req.params.id, function (err, item){
      if (err || !item) return next(err);
      // return res.json(item);
      return res.json({ message: 'Item deleted' });
    });
  });

  /**
   * PUT update existing auction item
   */
  app.put('/api/auctionitems/:id', auth.isLoggedInUser, function(req, res, next) { 
    AuctionItem.findByIdAndUpdate(req.params.id, req.body, function(err, item) {
      if (err || !item) return next(err);
      //return res.json(item);
      return res.json({ message: 'Item updated' });
    });
  });

  /**
   * POST new auction item
   */
  app.post('/api/auctionitems', auth.isLoggedInUser, function(req, res, next) {
    AuctionItem.create(req.body, function (err, item) {
      if (err || !item) return next(err);
      // return res.json(item);
      return res.json({ message: 'Item added' });
    });
  });

  // ---------------------------------------------------------------------------

}
