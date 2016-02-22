var log = require('../lib/log');
var Auction = require('../models/auction');
var AuctionItem = require('../models/auctionitem');
var Bid = require('../models/bid');
var passport = require("passport");
var auth = require('../lib/auth');

module.exports = function (app) {

  app.get('/api/logintest', auth.isLoggedInUser,
    function(req, res) {
      log.debug('common redirect');
      res.redirect('/');
  });

  app.post('/api/login', function(req, res, next) {
    log.debug('post');
    passport.authenticate('local', function(err, user, info) {
      log.debug('err');
      log.debug(err);
      if (err) return next(err)
      if (!user) {
        log.debug('!user');
        return res.status(422).json(info);
        // return res.redirect('/')
      }
      req.logIn(user, function(err) {
        log.debug('logIn');
        if (err) return next(err);
        log.debug('logIn2');
        return res.redirect('/');
      });
    })(req, res, next);
    // return res.redirect('/')

  });

  app.get('/logout', auth.isLoggedInUser, function(req, res){
    req.logout();
    res.redirect('/');
});
}
