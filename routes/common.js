var log = require('../lib/log');
var Auction = require('../models/auction');
var AuctionItem = require('../models/auctionitem');
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
}
