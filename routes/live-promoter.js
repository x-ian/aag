var Auction = require('../models/auction');
var AuctionItem = require('../models/auctionitem');

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

     AuctionItem.findById(req.params.id, function(err, item) {
       if (err || !item) return next(err);
       console.log(req.body.action);
       switch (req.body.action) {
         case "OPEN":
           item.status = 'NO_BIDS_YET';
           break;
         case "ACCEPT":
           item.status = 'WAITING_FOR_BIDS';
           break;
         case "REJECT":
          item.status = 'WAITING_FOR_BIDS';
          break;
         case "FINAL_CALL":
           item.status = 'WAITING_FINAL_CALL';
           break;
         case "SELL":
           item.status = 'SOLD';
           break;
         case "FINAL_CALL_EMPTY":
           item.status = 'WAITING_FINAL_CALL_EMPTY'
           break;
         case "CLOSE":
           item.status = 'CLOSED_EMPTY'
           break;
         default:
            console.log("Unknown status");
       }
       item.save(function (err) {
         if (err) return next(err);
         io.sockets.emit('auctionAction', {auctionItem: item});

         return res.json({auctionItem: item});
       });
     });
   });
}
