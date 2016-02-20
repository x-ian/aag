import React from 'react';
import {Link} from 'react-router';
import VehicleDetails from './VehicleDetails.js';
import PromoterStatus from './PromoterStatus.js';
import BidHistory from '../bidder/BidHistory.js';
import Participants from '../bidder/Participants.js';

class AuctionItem extends React.Component {

  constructor() {
    super();
  }

  render() {
    return (
      <div className='container-fluid'>
        <div className='row'>
           <div className='col-sm-6'>
                  { this.props.vehicle ? <VehicleDetails vehicle={this.props.vehicle}/> : '' }
                </div>
                <div className='col-sm-6'>
                  { this.props.auctionItem ? <PromoterStatus auctionItem={this.props.auctionItem} incomingBid={this.props.incomingBid} updateAfterAction={this.props.updateAfterAction.bind(this)}/> : '' }
                </div>
              </div>
              <div className='row'>
                 <div className='col-sm-6'>
                  { this.props.recentBids ? <BidHistory bids={this.props.recentBids}/> : '' }
                </div>
                <div className='col-sm-6'>
                  { this.props.participants ? <Participants participants={this.props.participants}/> : '' }
                </div>
              </div>
          </div>
    );
  }
}

export default AuctionItem;
