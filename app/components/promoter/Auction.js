import React from 'react';
import {Link} from 'react-router';

var Auction = React.createClass({
  getInitialState: function() {
    return {upcomingVehicles: [], closedAuctionItems: []};
  },

  componentDidMount: function() {
    $.ajax({
      url: '/api/upcomingvehicles',
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({upcomingVehicles: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
    $.ajax({
      url: '/api/closedauctionitems',
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({closedAuctionItems: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });

  },

  render: function () {
    let upcomingVehicleList = this.state.upcomingVehicles.map((sd, index) => {
      return (
        <div key={sd._id} className='list-group-item animated fadeIn'>
          <div className='media'>
            {sd._id} - {sd.vehicle.title} - {sd.vehicle.classification} -
            <Link
              to={'/promoter/auctionitem?salesDocumentId=' + sd._id + '&auctionId=' + this.props.params.id}>Activate</Link>
          </div>
        </div>
      );
    });
    let closedAuctionItemList = this.state.closedAuctionItems.map((ai, index) => {
      return (
        <div key={ai._id} className='list-group-item animated fadeIn'>
          <div className='media'>
            {ai._id} - {ai.salesDocument.vehicle.title} - {ai.salesDocument.vehicle.classification}
          </div>
        </div>
      );
    });

    return (
      <div className='container'>
        <div className='list-group'>
          <div className='panel-heading'>Upcoming Auction Items</div>
          {upcomingVehicleList}

          <div className='panel-heading'>Closed Auction Items</div>
          {closedAuctionItemList}
        </div>
      </div>
    );
  }
});

export default Auction;
