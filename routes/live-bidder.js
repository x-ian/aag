var Auction = require('../models/auction');
var AuctionItem = require('../models/auctionitem');
var Bid = require('../models/bid');

module.exports = function (app, io) {

  /**
   * GET next current or future auction
   */
   app.get('/api/nextauction', function(req, res, next) {
     Auction.findById('56a15d8cc5cabb091a24bd6b', function(err, item) {
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

   /**
    * GET next current or future auction
    */
    app.get('/api/currentauctionitem', function(req, res, next) {
      // TODO assume only one ever
      // AuctionItem.findById('56a53bf0e955ee0f54b1d651', function(err, item) {
        AuctionItem.findOne({}, function(err, item) {
        if (err || !item) return next(err);
        return res.json(item);
      });
    });


  auctionItemStatus
  app.post('/api/bidderaction/:id', function(req, res, next) {
    AuctionItem.findById(req.params.id, function(err, item) {
      if (err || !item) return next(err);
      if (req.body.action === 'BID') {
        switch (item.status) {
          case "NO_BIDS_YET":
            item.status = 'INCOMING_BID';
            break;
          case "WAITING_FOR_BIDS":
            item.status = 'INCOMING_BID';
            break;
          case "WAITING_FINAL_CALL":
           item.status = 'INCOMING_BID';
           break;
          case "WAITING_FINAL_CALL_EMPTY":
            item.status = 'INCOMING_BID';
            break;
          default:
             console.log("Unknown status - " + item.status);
        }
      } else {
        console.log("Unknown action - " + req.body.action);
      }
      item.save(function (err) {
        if (err) return next(err);

        // create the bid
        Bid.create({
            amount: 200,
            timestamp: new Date(),
            sequenceNumber: 0,
            status: 'PENDING',
            auctionItem: item._id,
            user: '56a61b7a0fb2b162ee581e5e',
            userIpAddress: req.ip
          }, function (err, bid) {
            if (err || !bid) return next(err);

          Bid.find({'auctionItem': req.params.id }).populate('user').sort('-timestamp').exec(function(err, bids) {
            if (err || !bids) return next(err);
            return res.json();

            // send back results to all
            io.sockets.emit('auctionAction',{auctionItem: item, recentBids: bids.slice(-5)});
            // just for this request
            return res.json({auctionItem: item, recentBids: bids.slice(-5)});
          });
        });
      });
    });
  });
}
