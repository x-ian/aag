import React from 'react';
import {Link} from 'react-router';
import AuctionItem from './AuctionItem.js';
import VehicleQueue from './VehicleQueue.js';
import AudioProducer from './AudioProducer.js';

var socket;

const resetState = {
  auction: null,
  auctionItem: null,
  salesDocument: null,
  vehicle: null,
  recentBids: [],
  participants: [],
  upcomingVehicles: [],
  closedAuctionItems: [],
  incompleteAuctionItems: []
}

class Auction extends React.Component {

  constructor() {
    super();
    this.state = resetState;
  }

  componentDidMount() {
    this.updateVehiclesQueues();

    socket = io.connect('/auction');

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

    // this.getCurrentAuction();
    // socket.on('auctionAction', (data) => {
    //   console.log('IO AuctionItem status ' + data);
    //   this.setState({auctionItem: data['auctionItem'] });
    //   this.setState({recentBids: data['recentBids'] });
    // });
    // socket.on('newAuctionItem', (data) => {
    //   console.log('IO newAuctionItem ' + data);
    //   this.setState({vehicle: data['vehicle']});
    //   this.setState({auctionItem: data['auctionItem']});
    //   this.setState({recentBids: null});
    // });
  }

  componentWillUnmount() {
    if (socket) {
      socket.removeListener('auctionAction');
      socket.removeListener('participants');
      socket.removeListener('newAuctionItem');
    }
  }

  broadCastPromoterAudioChunk(ab1) {
    socket.emit('producer audio chunk', ab1);
  }

  updateVehiclesQueues() {
    $.ajax({
      url: '/api/upcomingvehicles?auctionId=' + this.props.params.id,
      dataType: 'json',
      cache: false,
    }).done((data) => {
        this.setState({upcomingVehicles: data});
    }).fail((jqXhr) => {
      console.log('ERROR: ' + jqXhr);
    });
    $.ajax({
      url: '/api/closedauctionitems?auctionId=' + this.props.params.id,
      dataType: 'json',
      cache: false,
    }).done((data) => {
        this.setState({closedAuctionItems: data});
    }).fail((jqXhr) => {
      console.log('ERROR: ' + jqXhr);
    });
    $.ajax({
      url: '/api/incompleteauctionitems?auctionId=' + this.props.params.id,
      dataType: 'json',
      cache: false,
    }).done((data) => {
        this.setState({incompleteAuctionItems: data});
    }).fail((jqXhr) => {
      console.log('ERROR: ' + jqXhr);
    });
  }

  onClickAuctionItemActivate(salesDocumentId) {
    this.activateAuctionItem(salesDocumentId, this.props.params.id);
  }

  activateAuctionItem(salesDocumentId, auctionId) {
    event.preventDefault();
    $.ajax({
      url: '/api/activateauctionitem?salesDocumentId=' + salesDocumentId + '&auctionId=' + auctionId,
      type: 'POST',
      dataType: 'json'
    }).done((data) => {
      this.setState({auctionItem: data['auctionItem'] });
      this.setState({recentBids: data['recentBids'] });
      this.setState({vehicle: data['vehicle'] });
    }).fail((jqXhr) => {
      console.log('ERROR: ' + jqXhr);
    });
  }

  onClickAuctionItemReschedule(auctionItemId) {
    this.rescheduleAuctionItem(auctionItemId, this.props.params.id);
  }

  rescheduleAuctionItem(auctionItemId, auctionId) {
    event.preventDefault();
    $.ajax({
      url: '/api/rescheduleauctionitem/' + auctionItemId + '?auctionId=' + auctionId,
      type: 'POST',
      dataType: 'json'
    }).done((data) => {
      this.updateVehiclesQueues();
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
        this.updateVehiclesQueues();
        setTimeout(function(){
          this.setState({auctionItem: null, vehicle: null});
        }.bind(this), 2000);
      }
  }

  render() {
    return (
      <div>
        {this.state.auctionItem ?
          (
            <AuctionItem updateAfterAction={this.updateAfterAction.bind(this)}
              vehicle={this.state.vehicle}
              auctionItem={this.state.auctionItem}
              recentBids={this.state.recentBids}
              participants={this.state.participants}
              />
          ) : (
            <VehicleQueue auctionId={this.props.params.auctionId}
              onClickAuctionItemActivate={this.onClickAuctionItemActivate.bind(this)}
              onClickAuctionItemReschedule={this.onClickAuctionItemReschedule.bind(this)}
              upcomingVehicles={this.state.upcomingVehicles}
              closedAuctionItems={this.state.closedAuctionItems}
              incompleteAuctionItems={this.state.incompleteAuctionItems}/>
          )
        }
        <br/><br/><br/><AudioProducer/>
      </div>
    );
  }
}

export default Auction;
