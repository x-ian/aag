import React from 'react';
import {Link} from 'react-router';
import AuctionItem from './AuctionItem.js';
import AudioConsumer from './AudioConsumer.js';

var socket;

const resetState = {
  auction: null,
  auctionItem: null,
  vehicle: null,
  myLatestBid: null,
  recentBids: [],
  participants: []
}

class Auction extends React.Component {

  constructor() {
    super();
    this.state = resetState;
  }

  componentDidMount() {
    socket = io.connect('/auction');

    this.getCurrentAuction();
    socket.on('auctionAction', (data) => {
      console.log('IO AuctionItem status ' + data);
      this.setState({auctionItem: data['auctionItem'] });
      this.setState({recentBids: data['recentBids'] });
    });
    socket.on('participants', (data) => {
      console.log('IO participants ' + data);
      this.setState({participants: data });
    });
    socket.on('newAuctionItem', (data) => {
      console.log('IO newAuctionItem ' + data);
      this.setState({vehicle: data['vehicle']});
      this.setState({auctionItem: data['auctionItem']});
      this.setState({recentBids: null});
    });
  }

  componentWillUnmount() {
    socket.removeListener('auctionAction');
    socket.removeListener('participants');
    socket.removeListener('newAuctionItem');
    // socket.close();
  }

  getCurrentAuction(id) {
    $.ajax({
      url: '/api/currentauction',
      type: 'GET',
      dataType: 'json'
    }).done((data) => {
      this.setState({auction: data});
      this.getCurrentAuctionItem(this.state.auction._id);
    }).fail((jqXhr) => {
      console.log('ERROR: ' + jqXhr);
    });
  }

  getCurrentAuctionItem(auctionId) {
    $.ajax({
      url: '/api/currentauctionitem?auctionId=' + auctionId,
      type: 'GET',
      dataType: 'json'
    }).done((data) => {
      this.setState({auctionItem: data.auctionItem});
      this.setState({vehicle: data.vehicle});
      this.setState({recentBids: data.recentBids});
    }).fail((jqXhr) => {
      console.log('ERROR: ' + jqXhr);
    });
  }

  updateAfterAction(ai, button) {
      event.preventDefault();
      $.ajax({
        url: '/api/bidderaction2/' + this.state.auctionItem._id,
        dataType: 'json',
        type: 'POST',
        data: {
          action: button,
          auctionId: this.state.auction._id,
          recentAcceptedBidSequenceNumber: this.state.auctionItem.recentAcceptedBidSequenceNumber,
          bidAmount: this.state.auctionItem.nextExpectedBidAmount
        }
      }).done((data) => {
        this.setState({myLatestBid: data['myBid']});
      }).fail((jqXhr) => {
        console.log('ERROR: ' + jqXhr);
      });
  }

  render() {
    var auction = <h3 className='text-center'><br/><br/><br/>No active auction</h3>;
    if (this.state.auction && !this.state.auctionItem) auction = <h3 className='text-center'><br/><br/><br/>Active auction<br/>waiting for Auctioneer to release next AuctionItem</h3>;
    if (this.state.auctionItem) auction = <AuctionItem updateAfterAction={this.updateAfterAction.bind(this)} auctionItem={this.state.auctionItem} myLatestBid={this.state.myLatestBid} vehicle={this.state.vehicle} participants={this.state.participants} recentBids={this.state.recentBids}/>;

    return (
      <div>
        {auction}
        <br/><br/>        <AudioConsumer/>
      </div>
    );
  }
}

export default Auction;
