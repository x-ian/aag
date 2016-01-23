import React from 'react';
import {Link} from 'react-router';
import {isEqual} from 'underscore';

var Auctions = React.createClass({
  getInitialState: function() {
    return {auctions: []};
  },

  componentDidMount: function() {
    $.ajax({
      url: '/api/auctions',
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({auctions: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  render: function () {
    let auctionList = this.state.auctions.map((auction, index) => {
      return (
        <div key={auction._id} className='list-group-item animated fadeIn'>
          <div className='media'>
            {auction._id} - {auction.openAt} - {auction.closeAt} -
            <Link to={'/promoter/auctions/' + auction._id}>Activate</Link>
          </div>
        </div>
      );
    });

    return (
      <div className='container'>
        <div className='list-group'>
          <div className='panel-heading'>All auctions</div>
          {auctionList}
        </div>
      </div>
    );
  }
});

export default Auctions;
