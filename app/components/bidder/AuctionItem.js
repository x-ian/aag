import React from 'react';
import {Link} from 'react-router';
import VehicleDetails from '../promoter/VehicleDetails.js';
import AuctionStatus from './AuctionStatus.js';
import BidHistory from './BidHistory.js';
import Participants from './Participants.js';

const resetState = {
  auctionItem: null,
  vehicle: null,
  auction: null,
  participants: [],
  recentBids: [],
  // optimization shortcut
  lastestBid: null
}

class AuctionItem extends React.Component {

  constructor() {
    super();
    this.state = resetState;
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    // not sure if this works
    // this.props.socket.removeListener('auctionAction');
    // this.props.socket.removeListener('participants');
  }

  updateAfterAction(ai, button) {
      event.preventDefault();
      $.ajax({
        url: '/api/bidderaction/' + this.props.auctionItem._id,
        dataType: 'json',
        type: 'POST',
        data: {
          action: button
        }
      }).done((data) => {
        this.setState(data);
      }).fail((jqXhr) => {
        console.log('ERROR: ' + jqXhr);
      });
  }

  render() {
    return (
      <div className='container-fluid'>
        <div className='row'>
           <div className='col-sm-6'>
             { this.props.vehicle ? <VehicleDetails vehicle={this.props.vehicle}/> : '' }
           </div>
           <div className='col-sm-6'>
             { this.props.auctionItem ? <AuctionStatus status={this.props.auctionItem.status} updateAfterAction={this.updateAfterAction.bind(this)}/> : '' }
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
