import React from 'react';
import {Link} from 'react-router';
import {isEqual} from 'underscore';

class AuctionStatus extends React.Component {

  constructor() {
    super();
  }

  onClickBid(event) {
    this.props.updateAfterAction(event, 'BID');
  }

  render() {
    return (
        <div className='list-group'>
          <div className='panel-heading'>Status &amp; actions</div>
          <div key='button' className='list-group-item animated fadeIn'>
            <div className='media'>

              {(() => {
                switch (this.props.auctionItem.status) {
                  case "NOT_OPEN":
                    return <div>Wait for auctioneer to open</div>;
                  case "NO_BIDS_YET":
                  case "WAITING_FOR_BIDS":
                    if (this.props.myLatestBid && this.props.auctionItem.recentAcceptedBid && this.props.myLatestBid._id === this.props.auctionItem.recentAcceptedBid._id) {
                      return 'Highest bidder';
                    } else {
                      return <button className='btn btn-success' onClick={this.onClickBid.bind(this)}>Bid {this.props.auctionItem.nextExpectedBidAmount}</button>;
                    }
                  case "INCOMING_BID":
                    return <div>Please wait; processing bids</div>;
                  case "WAITING_FINAL_CALL":
                  case "WAITING_FINAL_CALL_EMPTY":
                    if (this.props.myLatestBid && this.props.auctionItem.recentAcceptedBid && this.props.myLatestBid._id === this.props.auctionItem.recentAcceptedBid._id) {
                      return 'Highest bidder';
                    } else {
                      return <button className='btn btn-warning' onClick={this.onClickBid.bind(this)}>Bid {this.props.auctionItem.nextExpectedBidAmount}</button>;
                    }
                  case "SOLD":
                    return '';
                  case "CLOSED_EMPTY":
                    return '';
                  default:
                    return "(unknown state)";
                }
              })()}

              &nbsp;({this.props.auctionItem.status})
            </div>
          </div>
        </div>
    );
  }
};

export default AuctionStatus;
