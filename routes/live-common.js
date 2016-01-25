var Auction = require('../models/auction');
var AuctionItem = require('../models/auctionitem');
var Bid = require('../models/bid');

module.exports = function (app, io) {

  app.get('/api/recentBids/:id', function(req, res, next) {

    Bid.find({'auctionItem': req.params.id }).populate('user').sort('-timestamp').exec(function(err, item) {
      if (err || !item) return next(err);
      return res.json(item.slice(-5));
    });
  });


}
