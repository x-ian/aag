var log = require('./log');

exports.isLoggedInUser = function isLoggedInUser(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
      log.verbose('isauth');
        return next();
    }
    // if they aren't redirect them to the home page
    log.verbose('not auth');
    res.redirect('/login');
}

exports.isLoggedInPromoter = function isLoggedInPromoter(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
      log.verbose('isauth');
        return next();
    }
    // if they aren't redirect them to the home page
    log.verbose('not auth');
    res.redirect('/login');
}

exports.isLoggedInAdmin = function isLoggedInAdmin(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
      log.verbose('isauth');
        return next();
    }
    // if they aren't redirect them to the home page
    log.verbose('not auth');
    res.redirect('/login');
}
