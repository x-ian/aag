var Auction = require('../models/auction');

module.exports = function (app) {

  /**
   * GET next current or future auction
   */
  app.get('/api/nextauction', function(req, res, next) {
    Auction.findById('56a4045f46480d0e40828d97', function(err, item) {
      if (err || !item) return next(err);
      return res.json({
        _id: item._id,
        location: item.location,
        openAt: item.openAt,
        closeAt: item.closeAt,
        currentlyActive: true
      });
    });
  });
}
