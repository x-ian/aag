import React from 'react';
import {Link} from 'react-router';

var VehicleQueue = React.createClass({

  render: function () {
    let upcomingVehicleList = this.props.upcomingVehicles.map((sd, index) => {
      return (
        <div key={sd._id} className='list-group-item animated fadeIn'>
          <div className='media'>
            {sd._id} - {sd.vehicle.title} - {sd.vehicle.classification} -
            <button className='btn btn-primary' onClick={this.props.onClickAuctionItemActivate.bind(this, sd._id)}>Activate</button>
          </div>
        </div>
      );
    });
    let closedAuctionItemList = this.props.closedAuctionItems.map((ai, index) => {
      return (
        <div key={ai._id} className='list-group-item animated fadeIn'>
          <div className='media'>
            {ai._id} - {ai.salesDocument.vehicle.title} - {ai.salesDocument.vehicle.classification} - <button className='btn btn-secondary' onClick={this.props.onClickAuctionItemReschedule.bind(this, ai._id)}>Reschedule</button>
          </div>
        </div>
      );
    });
    let incompleteAuctionItemList = this.props.incompleteAuctionItems.map((ai, index) => {
      return (
        <div key={ai._id} className='list-group-item animated fadeIn'>
          <div className='media'>
            {ai._id} - {ai.salesDocument.vehicle.title} - {ai.salesDocument.vehicle.classification} - <button className='btn btn-secondary' onClick={this.props.onClickAuctionItemReschedule.bind(this, ai._id)}>Reschedule</button>
          </div>
        </div>
      );
    });

    return (
      <div className='container'>
        <div className='list-group'>
          <div className='panel-heading'>Upcoming Vehicle</div>
          {upcomingVehicleList}

          <div className='panel-heading'>Incomplete Auction Items</div>
          {incompleteAuctionItemList}

          <div className='panel-heading'>Closed Auction Items</div>
          {closedAuctionItemList}
        </div>
      </div>
    );
  }
});

export default VehicleQueue;
