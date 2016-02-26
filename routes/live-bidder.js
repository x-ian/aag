var log = require('../lib/log');
var logLive = require('../lib/logLive');
var auth = require('../lib/auth');

var Auction = require('../models/auction');
var AuctionItem = require('../models/auctionitem');
var Vehicle = require('../models/vehicle');
var Bid = require('../models/bid');
var BidQueue = require('../models/bidqueue');

function calcNewAuctionItemStatus(action, prevStatus) {
  if (action === 'BID') {
    // TODO check if bid is 'too late'
    switch (prevStatus) {
      case "NO_BIDS_YET":
        return 'INCOMING_BID';
      case "WAITING_FOR_BIDS":
        return 'INCOMING_BID';
      case "WAITING_FINAL_CALL":
        return 'INCOMING_BID';
      case "WAITING_FINAL_CALL_EMPTY":
        return 'INCOMING_BID';
      default:
        log.error("Unknown status - " + prevStatus);
    }
  } else {
    log.error("Unknown action - " + action);
  }
}

module.exports = function(app, auctionIo, bidQueueStream, activateBidQueue) {

  /**
   * GET next current or future auction
   */
  app.get('/api/nextauction', function(req, res, next) {
    // find active one
    // active == true, closedAt == null, (scheduledAt == past)
    Auction.findOne({'active':true, 'closedAt':null}, function(err, item) {
      if (err) return next(err);
      if (!item) {
        // find next scheduled one
        // active == false, closedAt == null, (scheduledAt == future)
        // sort by scheduledAt, limit 1
        Auction.findOne({'active': false, 'closedAt': null})
          .sort('-scheduledAt').limit(1).exec(function(err2, item2) {
          if (err2) return next(err2);
          if (item2) {
            return res.json(item2);
          }
          // return empty result
          return res.json(null);
        });
      } else {
        return res.json(item);
      }
    });
  });

  app.get('/api/currentauctionitem', function(req, res, next) {
    var auctionId = req.query.auctionId;
    Auction.findById(auctionId).populate('currentAuctionItem').exec(function(err, a) {
      if (err || !a) return next(err);
      if (!a.currentAuctionItem) {
        // no current auction item yet
        return res.json({auctionItem: null, vehicle: null, recentBids: null});
      } else {
        Vehicle.findById(a.currentAuctionItem.vehicle, function(err, v) {
          Bid.find({'auctionItem':a.currentAuctionItem._id}).populate('user')
          .sort('-timestamp').limit(10).exec(function(err, bids) {
            if (err) return next(err);
            return res.json({auctionItem: a.currentAuctionItem, vehicle: v, recentBids: bids, currentBidId: null});
          });
        });
      }
    });
  });


  app.get('/api/currentauction', function(req, res, next) {
    Auction.findOne({}, function(err, item) {
      if (err || !item) return next(err);
      return res.json(item);
    });
  });

  app.post('/api/bidderaction2/:id', auth.isLoggedInUser, function(req, res, next) {
    var auctionItemId = req.params.id;
    var action = req.body.action;
    var auctionId=req.body.auctionId;
    var bidAmount = req.body.bidAmount;
    var recentAcceptedBidSequenceNumber = req.body.recentAcceptedBidSequenceNumber;
    var user = req.user;

    log.error(user);

    Bid.create({
      amount: bidAmount,
      timestamp: new Date(),
      // sequenceNumber: recentAcceptedBidSequenceNumber++,
      sequenceNumberBase: recentAcceptedBidSequenceNumber,
      status: 'PENDING',
      auctionItem: auctionItemId,
      user: user,
      userIpAddress: req.ip
    }, function(err, bid) {
      if (err) return next(err);
      logLive.action('bidder bidderaction2: ' + action + ' ' + auctionItemId + ' ' + auctionId + ' ' + bid._id, + ' ' + bidAmount + ' ' + recentAcceptedBidSequenceNumber);
      activateBidQueue();
      var bidQueueItem = new BidQueue({auction:auctionId, bid:bid});
      bidQueueItem.save();
      return res.json({myBid: bid});
    });
  });

  app.post('/api/bidderaction/:id', auth.isLoggedInUser, function(req, res, next) {
    var auctionItemId = req.params.id;
    var action = req.body.action;
    var bidAmount = req.body.bidAmount;
    var recentAcceptedBidSequenceNumber = req.body.recentAcceptedBidSequenceNumber;

    // TODO check if bid is too late

    // TOD check if bid values are consistent

    // 1: create a bid from incoming request
    Bid.create({
      amount: bidAmount,
      timestamp: new Date(),
      sequenceNumber: recentAcceptedBidSequenceNumber++,
      status: 'PENDING',
      auctionItem: auctionItemId,
      user: '56a61b7a0fb2b162ee581e5e', // TODO
      userIpAddress: req.ip
    }, function(err, bid) {
      if (err) return next(err);

      // 2: update auctionItem
      AuctionItem.findById(auctionItemId, function(err, item) {
        if (err || !item) return next(err);
        item.status = calcNewAuctionItemStatus(action, item.status);
        item.recentAcceptedBidAmount = bidAmount,
        item.nextExpectedBidAmount = parseInt(bidAmount) + parseInt(item.incrementBy);
        item.recentAcceptedBidSequenceNumber = recentAcceptedBidSequenceNumber;
        item.highestBid = bid;
        item.save(function(err) {
          if (err) return next(err);

          // 3. get new recent 5 bids
          Bid.find({'auctionItem':auctionItemId}).populate('user')
          .sort('-timestamp').limit(5).exec(function(err, bids) {
            if (err || !bids) return next(err);

            // send back results to all
            auctionIo.emit('auctionAction', {auctionItem: item, recentBids: bids, currentBidId: bid._id});
            // and just for this request
            return res.json({auctionItem: item, recentBids: bids});
          });
        });
      });
    });
  });

  /*  app.post('/api/bidderaction/:id', function(req, res, next) {
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
            log.info("Unknown status - " + item.status);
        }
      } else {
        log.info("Unknown action - " + req.body.action);
      }
      item.save(function(err) {
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
        }, function(err, bid) {
          if (err || !bid) return next(err);

          Bid.find({
            'auctionItem': req.params.id
          }).populate('user').sort('-timestamp').exec(function(err, bids) {
            if (err || !bids) return next(err);
            return res.json();

            // send back results to all
            io.sockets.emit('auctionAction', {
              auctionItem: item,
              recentBids: bids.slice(-5)
            });
            // just for this request
            return res.json({
              auctionItem: item,
              recentBids: bids.slice(-5)
            });
          });
        });
      });
    });
  });*/
}
