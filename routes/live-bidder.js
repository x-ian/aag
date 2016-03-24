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
}
