var auth = require('../lib/auth');
var log = require('../lib/log');
var logLive = require('../lib/logLive');

var Auction = require('../models/auction');
var Vehicle = require('../models/vehicle');
var AuctionItem = require('../models/auctionitem');
var Bid = require('../models/bid');

function auctionItemSaveAndEmit(item, res, auctionIo) {
  item.processingBid = false;
  item.save(function (err) {
    log.info('AuctionItem updated ' + item._id);
    if (err) return next(err);

    // 3. get new recent 10 bids
    Bid.find({'auctionItem':item._id}).populate('user')
    .sort('-timestamp').limit(10).exec(function(err, bids) {
      if (err || !bids) return next(err);

      // send back results to all
      auctionIo.emit('auctionAction', {auctionItem: item, recentBids: bids});
      // and just for this request
      return res.json({auctionItem: item, recentBids: bids});
    });
  });
}

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
       log.info("Unknown status");
  }
}

module.exports = function (app, auctionIo, bidQueueStream, deactivateBidQueue) {

    app.get('/api/upcomingvehicles', function(req, res, next) {
      // todo something with auctionId
      var auctionId = req.query['auctionId'];

      Vehicle.find({status: 'PUBLISHED'}, function(err, item) {
        if (err) return next(err);
        return res.json(item);
      });
      /*
      AuctionItem.find(
        {
          $and: [
            { auction: auctionId}//,
            // { $or: [ { status: 'NOT_OPEN' }, { status: null } ] }
          ]
        }).exec(function(err, items) {
          if (err) return next(err);
          // all salesdocuments
          let sdIds = items.map((ai) => { return ai.salesDocument });
          log.info(sdIds);
          SalesDocument.find({'_id': { $nin: sdIds }}).populate('vehicle').exec(function(err, item) {
            if (err) return next(err);
            return res.json(item);
          });
        });
        */
    });

    app.get('/api/closedauctionitems', function(req, res, next) {
      var auctionId = req.query['auctionId'];
      AuctionItem.find(
        {
          $and: [
            { auction: auctionId},
            { $or: [ { status: 'SOLD' }, { status: 'CLOSED_EMPTY' } ] }
          ]
        }).populate({ path: 'vehicle', model: 'Vehicle'}).exec(function(err, item) {
          if (err) return next(err);
          return res.json(item);
      });
    });

    app.get('/api/incompleteauctionitems', auth.isLoggedInPromoter, function(req, res, next) {
      var auctionId = req.query['auctionId'];
      AuctionItem.find(
        {
          $and: [
            { auction: auctionId},
            { status: { $nin: [ 'SOLD', 'CLOSED_EMPTY' ] } }
          ]
        }).populate({ path: 'vehicle', model: 'Vehicle'}).exec(function(err, item) {
          if (err) return next(err);
          return res.json(item);
      });
    });

  app.post('/api/reconnectauction/:id', auth.isLoggedInPromoter, function(req, res, next) {
    var auctionId = req.params.id;
    Auction.findById(auctionId).populate('currentAuctionItem').populate('recentIncomingBid').exec(function(err, auction) {
      if (err || !auction) return next(err);
      if (auction.currentAuctionItem) {
        logLive.log('action', 'promoter reconnect to auction: %s with active auctionItem: %s', auctionId, auction.currentAuctionItem._id );
        Vehicle.findById(auction.currentAuctionItem.vehicle, function(err, vehicle) {
          if (err || !vehicle) return next(err);
            Bid.find({'auctionItem':auction.currentAuctionItem._id}).populate('user')
              .sort('-timestamp').limit(10).exec(function(err, recentBids) {
              if (err) return next(err);
              // maybe emit not necessary as clients should still have the old data, but
              // also maybe better to make clear which item is active
              auctionIo.emit('newAuctionItem', {auctionItem: auction.currentAuctionItem, vehicle: vehicle, recentBids: recentBids});
              return res.json({auction: auction, auctionItem: auction.currentAuctionItem, vehicle: vehicle, recentIncomingBid: auction.recentIncomingBid, recentBids: recentBids});
            });
        });
      } else {
        logLive.log('action', 'promoter reconnect to auction: %s', auctionId );
        return res.json({auction: auction});
      }
    });
  });

  app.post('/api/startauction/:id', auth.isLoggedInPromoter, function(req, res, next) {
    var auctionId = req.params.id;
    // reset all active auctions
    Auction.update({ active: true }, { active: false } , {multi: true }, function(err, num) {
      if (err) return next(err);
      // activate select auction
      Auction.findByIdAndUpdate(auctionId, { startedAt: new Date(), closedAt: null, active: true }, function(err, item) {
        if (err || !item) return next(err);
        logLive.log('action', 'promoter startauction: %s', auctionId );
        return res.json(item);
      });
    });
  });

  app.post('/api/activateauctionitem', auth.isLoggedInPromoter, function(req, res, next) {
    var vehicleId = req.query.vehicleId;
    var auctionId = req.query.auctionId;

    // Vehicle.update({status: 'IN_AUCTION'}, {status: 'PUBLISHED'}, function(err, v) {
    // TODO: also reset auctionItems and Bids?
    Vehicle.findByIdAndUpdate(vehicleId, {status: 'IN_AUCTION'}, function(err, vehicle) {
      if (err || !vehicle) return next(err);
      // TODO what if a current auctionitem should be rejoined
      // Bid.find({'auctionitem.vehicle._id': vehicleId}).remove().exec();

      AuctionItem.find({vehicle: vehicleId}).remove().exec();
      var newAi = {
        startAmount: vehicle.auctionStartAmount,
        incrementBy: vehicle.auctionIncrement,
        expectedAmount: vehicle.auctionExpectedAmount,
        startTimestamp: new Date(),
        endTimestamp: null,
        status: 'NOT_OPEN',
        vehicle: vehicleId,
        auction: auctionId,
        recentAcceptedBidAmount: 0,
        recentAcceptedBidSequenceNumber: 0,
        nextExpectedBidAmount: vehicle.auctionStartAmount,
        highestBid: null
      }
      AuctionItem.create(newAi, function(err, ai2) {
        if (err || !ai2) return next(err);
        Auction.findByIdAndUpdate(auctionId, {currentAuctionItem: ai2}).exec();
        auctionIo.emit('newAuctionItem', {auctionItem: ai2, vehicle: vehicle, recentBids: null});
        logLive.log('action', 'promoter activateauctionitem: ' + ai2._id );
        return res.json({auctionItem: ai2, vehicle: vehicle, recentBids: null});
      });
    });
    // });
  });

  app.post('/api/rescheduleauctionitem/:id', auth.isLoggedInPromoter, function(req, res, next) {
    var auctionItemId = req.params.id;
    AuctionItem.findByIdAndRemove(auctionItemId, function(err, ai2) {
      if (err) return next(err);
      Vehicle.findByIdAndUpdate(ai2.vehicle, {status: 'PUBLISHED'}, function(err, item) {
        if (err) return next(err);
        Bid.remove({auctionItem: auctionItemId}, function(err){});
        // Bid.find({'auctionItem._id': auctionItemId}).remove().exec();
        deactivateBidQueue();
        logLive.log('action', 'promoter rescheduleauctionitem: %s', auctionItemId );
        return res.json({message: 'item resetted'});
      });
    });
  });

   app.post('/api/promoteraction2/:id', auth.isLoggedInPromoter, function(req, res, next) {

     var auctionItemId = req.params.id;
     var incomingBidId = req.body.incomingBidId;
     var action = req.body.action;

     log.info('PromoterAction ' + auctionItemId + ' ' + incomingBidId + ' ' + action);
     logLive.log('action', 'promoter promoteraction2: %s %s %s', action, auctionItemId, incomingBidId);

     AuctionItem.findById(auctionItemId).populate('vehicle').populate('recentAcceptedBid').exec(function(err, item) {
       if (err || !item) return next(err);

       item.status = calcNewAuctionItemStatus(action, item.status);

       switch (action) {
         case 'OPEN':
           return auctionItemSaveAndEmit(item, res, auctionIo);
           break;
         case 'ACCEPT':
           Bid.findByIdAndUpdate(incomingBidId, {status: 'ACCEPTED'}, function(err, bid) {
             if (err || !bid) return next(err);
             item.recentAcceptedBidAmount = bid.amount;
             item.nextExpectedBidAmount = bid.amount + item.incrementBy;
             item.recentAcceptedBidSequenceNumber = bid.sequenceNumberBase + 1;
             item.recentAcceptedBid = bid;
             return auctionItemSaveAndEmit(item, res, auctionIo);
           });
           break;
         case 'REJECT':
           // todo somehow undo rejected bid
           Bid.findByIdAndUpdate(incomingBidId, {status: 'REJECTED'}, function(err, bid) {
             if (err || !bid) return next(err);
            //  item.recentAcceptedBidSequenceNumber = bid.sequenceNumberBase + 1;
             return auctionItemSaveAndEmit(item, res, auctionIo);
           });
           break;
         case 'SELL':
           Bid.findByIdAndUpdate(incomingBidId, {status: 'WON'}, {new: true}, function(err, bid) {
             if (err || !bid) return next(err);
             item.nextExpectedBidAmount = null;
             item.endTimestamp = new Date();
             item.recentAcceptedBid = bid;

             item.vehicle.buyer = bid.user;
             item.vehicle.sellDate = new Date();
             item.vehicle.finalSellAmount = bid.amount;
             item.vehicle.status = 'SOLD_AUCTION';
             item.vehicle.save(function (err) {
               log.debug(err);
               log.debug('saved');
               log.debug(item.vehicle);
             });

             return auctionItemSaveAndEmit(item, res, auctionIo);
           });
           break;
         case 'FINAL_CALL':
           return auctionItemSaveAndEmit(item, res, auctionIo);
           break;
         case 'FINAL_CALL_EMPTY':
           return auctionItemSaveAndEmit(item, res, auctionIo);
           break;
         case 'CLOSE':
           item.vehicle.status = 'NOT_SOLD_AUCTION';
           item.vehicle.save(function (err) {
             log.debug(err);
             log.debug('saved');
             log.debug(item.vehicle);
           });
           
           return auctionItemSaveAndEmit(item, res, auctionIo);
           break;
         default:
           log.error('Unknown action');
           break;
       }
     });


/*
         if (incomingBidId) {
           Bid.findById(incomingBidId, function(err, bid) {
             if (err || !bid) return next(err);
             var bidStatus;
             if (action === 'ACCEPT') {
               bidStatus = 'ACCEPTED';
               item.recentAcceptedBidAmount = bid.amount;
               item.nextExpectedBidAmount = bid.amount + item.incrementBy;
               item.recentAcceptedBidSequenceNumber = bid.sequenceNumberBase + 1;
             } else if (action === 'REJECT') {
               bidStatus = 'REJECTED';
             } else if (action === 'SELL') {
               bidStatus = 'WON';
               item.nextExpectedBidAmount = null;
               item.endTimestamp = new Date();
             } if (action else {
               log.info('Unknown combination of action (%s, %s) and currentbid', action, item.status);
             }
             bid.status = bidStatus;
             bid.save();

             return auctionItemSaveAndEmit(item, res, auctionIo);
           });
         } else if (action === 'ACCEPT' || action === 'REJECTED' || action === 'SELL') {
           log.info('Unknown combination of action and currentbid');
         } else {
           return auctionItemSaveAndEmit(item, res, auctionIo);
         }
       });
       */
   });

   app.post('/api/promoteraction/:id', auth.isLoggedInPromoter, function(req, res, next) {

     var auctionItemId = req.params.id;
     var currentBidId = req.body.currentBidId;
     var action = req.body.action;

     log.info('PromoterAction ' + auctionItemId + ' ' + currentBidId + ' ' + action);

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
           log.info('Unknown combination of action and currentbid');
         }
         Bid.findByIdAndUpdate(currentBidId, {status: bidStatus}).exec();
       } else if (action === 'ACCEPT' || action === 'REJECTED' || action === 'SELL') {
         log.info('Unknown combination of action and currentbid');
       }

       item.save(function (err) {
         log.info('AuctionItem updated ' + item._id);
         if (err) return next(err);

         // 3. get new recent 5 bids
         Bid.find({'auctionItem':auctionItemId}).populate('user')
         .sort('-timestamp').limit(5).exec(function(err, bids) {
           if (err || !bids) return next(err);

           // send back results to all
           auctionIo.emit('auctionAction', {auctionItem: item, recentBids: bids, currentBidId: null});
           // and just for this request
           return res.json({auctionItem: item, recentBids: bids});
         });
       });
     });
   });
}
