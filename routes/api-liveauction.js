var Auction = require('../models/auction');

module.exports = function (app, io) {

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

  app.get('/api/newbid', function(req, res, next) {
    io.sockets.emit('recentBid', {
      _id: 1234,
      amount: 200,
      status: 'accepted',
      timestamp: new Date(),
      sequenceNumber: 1,
      user: { name: 'ichichich'}
    });

    return res.json({ message: 'Item deleted' });
  });

}
