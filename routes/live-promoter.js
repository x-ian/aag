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

     AuctionItem.findById(auctionItemId, function(err, item) {
       if (err || !item) return next(err);
       console.log(req.body.action);

       item.status = calcNewAuctionItemStatus(req.body.action, item.status);
       // TODO update bid if necessary

       item.save(function (err) {
         if (err) return next(err);

         // 3. get new recent 5 bids
         Bid.find({'auctionItem':auctionItemId}).populate('user')
         .sort('-timestamp').limit(5).exec(function(err, bids) {
           if (err || !bids) return next(err);

           // send back results to all
           io.sockets.emit('auctionAction', {auctionItem: item, recentBids: bids});
           // and just for this request
           return res.json({auctionItem: item, recentBids: bids});
         });
       });
     });
   });
}
