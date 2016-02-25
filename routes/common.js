var log = require('../lib/log');
var Auction = require('../models/auction');
var AuctionItem = require('../models/auctionitem');
var Vehicle = require('../models/vehicle');
var Bid = require('../models/bid');
var passport = require("passport");
var auth = require('../lib/auth');

module.exports = function (app) {

  app.get('/api/logintest', auth.isLoggedInUser,
    function(req, res) {
      log.debug(req.user);
      log.debug('common redirect');
      res.redirect('/');
  });

  app.get('/api/activesession', function(req, res, next) {
    if (req.user) {
      return res.json({ activeSession: true });
    }
    return res.json({ activeSession: false });
  });

  app.get('/api/activeuser', function(req, res, next) {
    if (req.user) {
      return res.json({ activeUser: req.user });
    }
    return res.json({ activeUser: null });
  });

  app.post('/api/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) return next(err)
      if (!user) {
        return res.status(422).json(info);
        // return res.redirect('/')
      }
      req.logIn(user, function(err) {
        if (err) return next(err);
        return res.redirect('/');
      });
    })(req, res, next);
  });

  app.get('/logout', auth.isLoggedInUser, function(req, res){
    req.logout();
    res.redirect('/');
  });

  app.post('/api/buynow/:vehicleId', auth.isLoggedInUser, function(req, res, next) {
    var vehicleId = req.params.vehicleId;
    var buyer = req.user;
    var buyNowAmount = req.body['buyNowAmount'];

    Vehicle.findById(vehicleId, function(err, item) {
      if (err || !item) return next(err);
      if (item.status === 'PUBLISHED' || item.status === 'IN_AUCTION') {
        log.debug(item.buyNowAmount);
        log.debug(buyNowAmount);
        if (item.buyNowAmount == buyNowAmount) {
          item.status = 'SOLD_BUY_NOW';
          item.sellDate = new Date();
          item.finalSellAmount = item.buyNowAmount;
          item.buyer = buyer;
          item.save();
          return res.json({ message: 'Item sold' });
        } else {
          return res.status(422).json({message: 'Vehicle not be sold because of mitmatch in amounts'});
        }
      } else {
        // work status, not sell-able
        return res.status(422).json({message: 'Vehicle can not be sold because of wrong status: ' + item.status});
      }
    });
  });
}
