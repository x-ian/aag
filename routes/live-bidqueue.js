var log = require('../lib/log');
var logLive = require('../lib/logLive');

var Auction = require('../models/auction');
var AuctionItem = require('../models/auctionitem');
var Vehicle = require('../models/vehicle');
var Bid = require('../models/bid');
var BidQueue = require('../models/bidqueue');

module.exports = function(app, socketPromoter, socketAuction, bidQueueStream, isBidQueueActive) {

  bidQueueStream.on('error', function (err) {
  	log.error(err);
  });

  // listen to the mongo capped collection
  bidQueueStream.on('data', function(bidQueue){
    if (!isBidQueueActive()) {
      log.debug('ignoring current bidqueue');
      return;
    }

    // possible bid status: { type: String, enum: ['PENDING', 'TOO_LATE', 'ACCEPTED', 'REJECTED', 'WON', 'INVALID'] },

    // make sure that after node restart not all queued bids are reprocessed
    // at least filter out

    // consistency and validation checks

    // check if more recent bid was already processed

    // notify promoter about valid incoming bid
    Bid.findById(bidQueue.bid, function(err, bid) {
      if (err || !bid) log.error(err);
      log.debug('processing bid queue item ' + bid._id);

      AuctionItem.findOneAndUpdate({ _id: bid.auctionItem, processingBid: false }, {processingBid: true}, function(err, item) {
        if (err) {
          log.error(err);
          return;
        }
        if (!item) {
          // assuming server currently already processes bid; reject this one
          // even though this risks to deny a valid bid due to processing an invalid bid
          bid.status = 'REJECTED_SERVER_BUSY';
          bid.save();
          AuctionItem.findById(bid.auctionItem, function(err, item) {
            if (err || !item) {
              log.error(err);
              return;
            }
            socketAuction.emit('auctionAction', {auctionItem: item, recentBids: null, currentBidId: null});
            logLive.log('action', 'bidqueue reject server busy: %s %s %s %s %s', bid.auctionItem._id, bid.auctionItem.status, bid.auctionItem.recentAcceptedBidAmount, bid.auctionItem.nextExpectedBidAmount, bid.auctionItem.recentAcceptedBidSequenceNumber);
          });
          return;
        }
        if (bid.sequenceNumberBase == item.recentAcceptedBidSequenceNumber) {
          log.info('bid accepted forwarded to promoter');
          item.recentAcceptedBidSequenceNumber = item.recentAcceptedBidSequenceNumber++;
          item.status = 'INCOMING_BID';
          item.save();
          socketPromoter.emit('incoming bid', { auctionItem: item, incomingBid: bid});
          // TODO let clients know that bid is processed
          socketAuction.emit('auctionAction', {auctionItem: item, recentBids: null, currentBidId: null});
        } else {
          log.info('bid arrived to late');
          bid.status = 'REJECTED_OUTDATED';
          bid.save();
          item.processingBid = false;
          item.save();
          logLive.log('action', 'bidqueue reject outdated: %s %s %s %s %s', bid.auctionItem._id, bid.auctionItem.status, bid.auctionItem.recentAcceptedBidAmount, bid.auctionItem.nextExpectedBidAmount, bid.auctionItem.recentAcceptedBidSequenceNumber);
          socketAuction.emit('auctionAction', {auctionItem: item, recentBids: null, currentBidId: null});
        }
      });
    });
  });
}
