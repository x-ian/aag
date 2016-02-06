import React from 'react';
import {Link} from 'react-router';
import VehicleDetails from './VehicleDetails.js';
import PromoterStatus from './PromoterStatus.js';

import BidHistory from '../bidder/BidHistory.js';
import Participants from '../bidder/Participants.js';

const resetState = {
  auctionItem: null,
  vehicle: null,
  auction: null,
  salesDocument: null,
  participants: [],
  recentBids: [],
  currentBidId: null,
  // optimization shortcut
  latestBid: null
}

class AuctionItem extends React.Component {

  constructor() {
    super();
    this.state = resetState;
  }

  componentDidMount() {
    if (this.props.location.query.salesDocumentId && this.props.location.query.auctionId) {
      this.activateAuctionItem(this.props.location.query.salesDocumentId, this.props.location.query.auctionId);
    };

    let socket = io.connect();
    socket.on('auctionAction', (data) => {
      console.log('IO AuctionItem status ' + this.state.auctionItem.status);
      this.setState({auctionItem: data['auctionItem'] });
      this.setState({recentBids: data['recentBids'] });
      // TODO: if already a current bid present, deny this newly incoming one
      this.setState({currentBidId: null});
      if (data['currentBidId']) this.setState({currentBidId: data['currentBidId'] });
    });
    socket.on('participants', (data) => {
      this.setState({participants: data });
    });

  }

  activateAuctionItem(salesDocumentId, auctionId) {
    $.ajax({
      url: '/api/activateauctionitem?salesDocumentId=' + salesDocumentId + '&auctionId=' + auctionId,
      type: 'POST',
      dataType: 'json'
    }).done((data) => {
      console.log(data);
      this.setState({auctionItem: data['auctionItem'] });
      this.setState({recentBids: data['recentBids'] });
      this.setState({vehicle: data['vehicle'] });
    }).fail((jqXhr) => {
      console.log('ERROR: ' + jqXhr);
    });
  }

  updateAfterAction(ai, button) {

      event.preventDefault();
      $.ajax({
        url: '/api/promoteraction/' + this.state.auctionItem._id,
        dataType: 'json',
        type: 'POST',
        data: {
          action: button,
          currentBidId: this.state.currentBidId
        }
      }).done((data) => {
        this.setState(data);
      }).fail((jqXhr) => {
        console.log('ERROR: ' + jqXhr);
      });
      if (button === 'SELL' || button === 'CLOSE') {
        console.log('JAAAAAA');
        setTimeout(function(){
          this.props.history.pushState(null, '/promoter/auctions/' + this.props.location.query.auctionId);
        }.bind(this), 1000);
      }
  }

  render() {
    return (
      <div className='container-fluid'>
        <div className='row'>
           <div className='col-sm-6'>
                  { this.state.vehicle ? <VehicleDetails vehicle={this.state.vehicle}/> : '' }
                </div>
                <div className='col-sm-6'>
                  { this.state.auctionItem ? <PromoterStatus status={this.state.auctionItem.status} updateAfterAction={this.updateAfterAction.bind(this)}/> : '' }
                </div>
              </div>
              <div className='row'>
                 <div className='col-sm-6'>
                  { this.state.recentBids ? <BidHistory bids={this.state.recentBids}/> : '' }
                </div>
                <div className='col-sm-6'>
                  { this.state.participants ? <Participants participants={this.state.participants}/> : '' }
                </div>
              </div>
          </div>
    );
  }
}

export default AuctionItem;
