import React from 'react';
import {Link} from 'react-router';

var Auction = React.createClass({
  getInitialState: function() {
    return {upcomingAuctionItems: [], closedAuctionItems: []};
  },

  componentDidMount: function() {
    $.ajax({
      url: '/api/openauctionitems',
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({upcomingAuctionItems: data});
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
    let upcomingAuctionItemList = this.state.upcomingAuctionItems.map((ai, index) => {
      return (
        <div key={ai._id} className='list-group-item animated fadeIn'>
          <div className='media'>
            {ai._id} - {ai.vehicle.title} - {ai.vehicle.classification} -
            <Link
              to={'/promoter/auctionitem/' + ai._id + '?auctionId=' + this.props.params.id}>Activate</Link>
          </div>
        </div>
      );
    });
    let closedAuctionItemList = this.state.closedAuctionItems.map((ai, index) => {
      return (
        <div key={ai._id} className='list-group-item animated fadeIn'>
          <div className='media'>
            {ai._id} - {ai.vehicle.title} - {ai.vehicle.classification}
          </div>
        </div>
      );
    });

    return (
      <div className='container'>
        <div className='list-group'>
          <div className='panel-heading'>Upcoming Auction Items</div>
          {upcomingAuctionItemList}

          <div className='panel-heading'>Closed Auction Items</div>
          {closedAuctionItemList}
        </div>
      </div>
    );
  }
});

export default Auction;
