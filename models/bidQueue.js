var mongoose = require('mongoose');

var bidQueueSchema = new mongoose.Schema({
    auction: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Auction'
    },
    bid: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Bid'
    }
  },
  {
  	capped:{
  		size: 64000,
  		max: 1000,
  		autoIndexId: true
  	}
});

module.exports = mongoose.model('BidQueue', bidQueueSchema);
