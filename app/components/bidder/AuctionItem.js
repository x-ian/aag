import React from 'react';
import {Link} from 'react-router';
import VehicleDetails from '../promoter/VehicleDetails.js';
import AuctionStatus from './AuctionStatus.js';
import BidHistory from './BidHistory.js';

const resetState = {
  auctionItem: null,
  vehicle: null,
  auction: null,
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
    this.getAuctionItem(this.props.id);

    let socket = io.connect();
    socket.on('auctionAction', (data) => {
      console.log('IO AuctionItem status ' + this.state.auctionItem.status);
      this.setState({auctionItem: data['auctionItem'] });
      this.setState({recentBids: data['recentBids'] });
    });
  }

  componentWillUnmount() {
    // not sure if this works
    socket.removeListener('auctionAction');
  }

  getVehicle(id) {
    $.ajax({
      url: '/api/vehicles/' + id,
      dataType: 'json'
    }).done((data) => {
        this.setState({vehicle: data});
    }).fail((jqXhr) => {
      console.log('ERROR: ' + jqXhr);
    });
  }

  getRecentBids(auctionItemId) {
    $.ajax({
      url: '/api/recentBids/' + auctionItemId,
      dataType: 'json'
    }).done((data) => {
        this.setState({recentBids: data});
    }).fail((jqXhr) => {
      console.log('ERROR: ' + jqXhr);
    });
  }

  getAuctionItem(id) {
    $.ajax({
      url: '/api/auctionitems/' + id,
      type: 'GET',
      dataType: 'json'
    }).done((data) => {
      this.setState({auctionItem: data});
      this.getVehicle(this.state.auctionItem.vehicle);
      this.getRecentBids(this.state.auctionItem._id);
    }).fail((jqXhr) => {
      console.log('ERROR: ' + jqXhr);
    });
  }

  updateAfterAction(ai, button) {
      event.preventDefault();
      $.ajax({
        url: '/api/bidderaction/' + this.state.auctionItem._id,
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
      <div className='container'>
        <div className='list-group'>
          <table>
            <tbody>
              <tr>
                <td>
                  { this.state.vehicle ? <VehicleDetails vehicle={this.state.vehicle}/> : '' }
                </td>
                <td>
                  { this.state.auctionItem ? <AuctionStatus status={this.state.auctionItem.status} updateAfterAction={this.updateAfterAction.bind(this)}/> : '' }
                </td>
              </tr>
              <tr>
                <td>
                  { this.state.recentBids ? <BidHistory bids={this.state.recentBids}/> : '' }
                </td>
                <td>
                  Online participants:<br/>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default AuctionItem;
