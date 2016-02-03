import React from 'react';
import {Link} from 'react-router';
import AuctionItem from './AuctionItem.js';

const resetState = {
  currentAuctionItem: null,
  auction: null,
  socket: null
}

class Auction extends React.Component {

  constructor() {
    super();
    this.state = resetState;
  }

  componentDidMount() {
    // let socket = io.connect();
    // this.setState({socket: socket});
    this.getAuction(this.props.params.id);
  }

  getAuction(id) {
    $.ajax({
      url: '/api/auctions/' + id,
      type: 'GET',
      dataType: 'json'
    }).done((data) => {
      this.setState({auction: data});
      this.getCurrentAuctionItem();
    }).fail((jqXhr) => {
      console.log('ERROR: ' + jqXhr);
    });
  }

  getCurrentAuctionItem() {
    $.ajax({
      url: '/api/currentauctionitem',
      type: 'GET',
      dataType: 'json'
    }).done((data) => {
      this.setState({currentAuctionItem: data});
    }).fail((jqXhr) => {
      console.log('ERROR: ' + jqXhr);
    });
  }

  render() {
    return (
      <div>
        { this.state.currentAuctionItem ? <AuctionItem id={this.state.currentAuctionItem._id} socket={this.props.socket}/> : 'nothing active' }
      </div>
    );
  }
}

export default Auction;
