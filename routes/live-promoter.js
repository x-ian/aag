var Auction = require('../models/auction');
var AuctionItem = require('../models/auctionitem');
var Bid = require('../models/bid');

function calcNewAuctionItemStatus(action, prevStatus) {
  switch (action) {
    case "OPEN":
      return 'NO_BIDS_YET';
      break;
    case "ACCEPT":
      return 'WAITING_FOR_BIDS';
      break;
    case "REJECT":
     return 'WAITING_FOR_BIDS';
     break;
    case "FINAL_CALL":
      return 'WAITING_FINAL_CALL';
      break;
    case "SELL":
      return 'SOLD';
      break;
    case "FINAL_CALL_EMPTY":
      return 'WAITING_FINAL_CALL_EMPTY'
      break;
    case "CLOSE":
      return 'CLOSED_EMPTY'
      break;
    default:
       console.log("Unknown status");
  }
}

module.exports = function (app, io) {

  app.post('/api/startauction/:id', function(req, res, next) {
    Auction.findByIdAndUpdate(req.params.id, { closedAt: null, active: true }, function(err, item) {
      if (err || !item) return next(err);
      // simply take first vehicle for now and create/overwrite an auctionitem
      Vehicle.findOne
      return res.json({ message: 'Auction started' });
    });
  });

   app.post('/api/getorcreateauctionitem/:id', function(req, res, next) {
     AuctionItem.findOne({'vehicle': req.params.id }, function(err, item) {
       if (err) return next(err);
       if (!item) {
         console.log('no matching auction item');
         // does not exist, create new one
         AuctionItem.create({
           startAmount: 200,
           incrementBy: 50,
           status: 'NOT_OPEN',
           startTimestamp: new Date(),
           endTimestamp: null,
           vehicle: req.params.id,
           auction: '56a15d8cc5cabb091a24bd6b'
         }, function (err2, item2) {
           if (err2 || !item2) return next(err2);
           // return res.json(item);
           return res.json(item2);
         });
       } else {
         // already there, assume for now we want to (re)use this
         console.log('auction item already there');
         return res.json(item);
      }
     });
   });

   app.post('/api/promoteraction/:id', function(req, res, next) {

     var auctionItemId = req.params.id;
     var currentBidId = req.body.currentBidId;
     var action = req.body.action;

     AuctionItem.findById(auctionItemId, function(err, item) {
       if (err || !item) return next(err);

       item.status = calcNewAuctionItemStatus(action, item.status);
       if (currentBidId) {
         var bidStatus;
         if (action === 'ACCEPT') {
           bidStatus = 'ACCEPTED';
         } else if (action === 'REJECT') {
           bidStatus = 'REJECTED';
         } else if (action === 'SELL') {
           bidStatus = 'WON';
         } else {
           console.log('Unknown combination of action and currentbid');
         }
         Bid.findByIdAndUpdate(currentBidId, {status: bidStatus}).exec();
       } else if (action === 'ACCEPT' || action === 'REJECTED' || action === 'SELL') {
         console.log('Unknown combination of action and currentbid');
       }

       item.save(function (err) {
         if (err) return next(err);

         // 3. get new recent 5 bids
         Bid.find({'auctionItem':auctionItemId}).populate('user')
         .sort('-timestamp').limit(5).exec(function(err, bids) {
           if (err || !bids) return next(err);

           // send back results to all
           io.sockets.emit('auctionAction', {auctionItem: item, recentBids: bids, currentBidId: null});
           // and just for this request
           return res.json({auctionItem: item, recentBids: bids});
         });
       });
     });
   });
}
