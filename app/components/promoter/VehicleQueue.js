import React from 'react';
import {Link} from 'react-router';
import VehicleViewShort from '../common/VehicleViewShort.js';

var VehicleQueue = React.createClass({

  render: function () {
    let upcomingVehicleList = this.props.upcomingVehicles.map((vehicle, index) => {
      return (
        <div key={vehicle._id} className='list-group-item row'>
          <VehicleViewShort vehicle={vehicle} action='VehiclePromoterActivate' onClickAuctionItemActivate={this.props.onClickAuctionItemActivate}/>
        </div>
      );
    });
    let closedAuctionItemList = this.props.closedAuctionItems.map((ai, index) => {
      return (
        <div key={ai._id} className='list-group-item row'>
          <VehicleViewShort vehicle={ai.vehicle} auctionItem={ai} action='VehiclePromoterReschedule' onClickAuctionItemReschedule={this.props.onClickAuctionItemReschedule}/>
        </div>
      );
    });
    let incompleteAuctionItemList = this.props.incompleteAuctionItems.map((ai, index) => {
      return (
        <div key={ai._id} className='list-group-item row'>
          <VehicleViewShort vehicle={ai.vehicle} auctionItem={ai} action='VehiclePromoterReschedule' onClickAuctionItemReschedule={this.props.onClickAuctionItemReschedule}/>
        </div>
      );
    });

    return (
      <div className='container'>
        <div className='list-group'>
          <div className='panel-heading'>Upcoming Vehicles</div>
          {this.props.upcomingVehicles && upcomingVehicleList}

          <div className='panel-heading'>Incomplete Auction Items</div>
          {incompleteAuctionItemList}

          <div className='panel-heading'>Closed Auction Items</div>
          {this.props.closedAuctionItems && closedAuctionItemList}
        </div>
      </div>
    );
  }
});

export default VehicleQueue;
