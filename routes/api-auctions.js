var Auction = require('../models/auction');

module.exports = function (app) {

  /**
   * GET all auctions
   */
  app.get('/api/auctions', function(req, res, next) {
    Auction.find(function(err, item) {
      if (err || !item) return next(err);
      // return res.send(item);
      return res.json(item);
    });
  });

  /**
   * GET one auction
   */
  app.get('/api/auctions/:id', function(req, res, next) { 
    Auction.findById(req.params.id, function(err, item) {
      if (err || !item) return next(err);
      return res.json(item);
    });
  });

  /**
   * DELETE one auction
   */
  app.delete('/api/auctions/:id', function(req,res,next) {
    Auction.findByIdAndRemove(req.params.id, function (err, item){
      if (err || !item) return next(err);
      // return res.json(item);
      return res.json({ message: 'Item deleted' });
    });
  });

  /**
   * PUT update existing auction
   */
  app.put('/api/auctions/:id', function(req, res, next) { 
    Auction.findByIdAndUpdate(req.params.id, req.body, function(err, item) {
      if (err || !item) return next(err);
      //return res.json(item);
      return res.json({ message: 'Item updated' });
    });
  });

  /**
   * POST new auction 
   */
  app.post('/api/auctions', function(req, res, next) {
    Auction.create(req.body, function (err, item) {
      if (err || !item) return next(err);
      // return res.json(item);
      return res.json({ message: 'Item added' });
    });
  });

}
