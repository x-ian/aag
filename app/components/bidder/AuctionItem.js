import React from 'react';
import {Link} from 'react-router';
import VehicleDetails from '../promoter/VehicleDetails.js';
import AuctionStatus from './AuctionStatus.js';
import BidHistory from './BidHistory.js';
import Participants from './Participants.js';

class AuctionItem extends React.Component {

  constructor() {
    super();
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    // not sure if this works
    // this.props.socket.removeListener('auctionAction');
    // this.props.socket.removeListener('participants');
  }

  render() {
    return (
      <div className='container-fluid'>
        <div className='row'>
           <div className='col-sm-6'>
             { this.props.vehicle ? <VehicleDetails vehicle={this.props.vehicle}/> : '' }
           </div>
           <div className='col-sm-6'>
             { this.props.auctionItem ? <AuctionStatus auctionItem={this.props.auctionItem} myLatestBid={this.props.myLatestBid} updateAfterAction={this.props.updateAfterAction.bind(this)}/> : '' }
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
