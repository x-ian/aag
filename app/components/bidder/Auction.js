import React from 'react';
import {Link} from 'react-router';
import AuctionItem from './AuctionItem.js';

var socket;

const resetState = {
  auction: null,
  auctionItem: null,
  salesDocument: null,
  vehicle: null,
  recentBids: [],
  participants: []
}

class Auction extends React.Component {

  constructor() {
    super();
    this.state = resetState;
  }

  componentDidMount() {
    socket = io.connect();

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
      this.setState({salesDocument: data.salesDocument});
    }).fail((jqXhr) => {
      console.log('ERROR: ' + jqXhr);
    });
  }

  getVehicle(id) {
    $.ajax({
      url: '/api/vehiclesfull/' + id,
      dataType: 'json'
    }).done((data) => {
    }).fail((jqXhr) => {
      console.log('ERROR: ' + jqXhr);
    });
  }

  render() {
    var auction = <h3 className='text-center'><br/><br/><br/>No active auction</h3>;
    if (this.state.auction && !this.state.auctionItem) auction = <h3 className='text-center'><br/><br/><br/>Active auction<br/>waiting for Auctioneer to release next AuctionItem</h3>;
    if (this.state.auctionItem) auction = <AuctionItem auctionItem={this.state.auctionItem} vehicle={this.state.vehicle} participants={this.state.participants} recentBids={this.state.recentBids}/>;

    return (
      <div>
        {auction}
      </div>
    );
  }
}

export default Auction;
