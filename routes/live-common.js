var auth = require('../lib/auth');
var Auction = require('../models/auction');
var AuctionItem = require('../models/auctionitem');
var Bid = require('../models/bid');

module.exports = function (app, auctionIo, clients, bidQueueStream) {

  app.get('/api/recentBids/:id', auth.isLoggedInUser, function(req, res, next) {

    Bid.find({'auctionItem': req.params.id }).populate('user').sort('-timestamp').exec(function(err, item) {
      if (err || !item) return next(err);
      return res.json(item.slice(-10));
    });
  });

  app.get('/api/participants', auth.isLoggedInUser, function(req, res, next) {
    // console.log(clients);
    var keys = Object.keys(clients);
    var values = keys.map(function(v) { return clients[v]; });

    return res.json(values);
  });
}
