var Auction = require('../models/auction');
var Vehicle = require('../models/vehicle');
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

module.exports = function (app, auctionIo, bidQueueStream) {

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
          console.log(sdIds);
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

    app.get('/api/incompleteauctionitems', function(req, res, next) {
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


  app.post('/api/startauction/:id', function(req, res, next) {
    console.log('1');
    // reset all active auctions
    Auction.update({ active: true }, { active: false } , {multi: true }, function(err, num) {
      console.log('2');
      if (err) return next(err);
      // activate select auction
      console.log('3');
      Auction.findByIdAndUpdate(req.params.id, { startedAt: new Date(), closedAt: null, active: true }, function(err, item) {
        console.log('4');
        if (err || !item) return next(err);
        console.log('5');
        return res.json(item);
      });
    });
  });

  app.post('/api/activateauctionitem', function(req, res, next) {
    var vehicleId = req.query.vehicleId;
    var auctionId = req.query.auctionId;

    Vehicle.findByIdAndUpdate(vehicleId, {status: 'IN_AUCTION'}, function(err, vehicle) {
      if (err || !vehicle) return next(err);
      // TODO what if a current auctionitem should be rejoined
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
        return res.json({auctionItem: ai2, vehicle: vehicle, recentBids: null});
      });
    });
  });

  app.post('/api/rescheduleauctionitem/:id', function(req, res, next) {
    var auctionItemId = req.params.id;
    AuctionItem.findByIdAndRemove(auctionItemId, function(err, ai2) {
      if (err) return next(err);
      Vehicle.findByIdAndUpdate(ai2.vehicle, {status: 'PUBLISHED'}, function(err, item) {
        if (err) return next(err);
        Bid.find({auctionItem: auctionItemId}).remove().exec();
        return res.json({message: 'item resetted'});
      });
    });
  });

   app.post('/api/promoteraction/:id', function(req, res, next) {

     var auctionItemId = req.params.id;
     var currentBidId = req.body.currentBidId;
     var action = req.body.action;

     console.log('PromoterAction ' + auctionItemId + ' ' + currentBidId + ' ' + action);

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
         console.log('AuctionItem updated ' + item._id);
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
