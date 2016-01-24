import React from 'react';
import {Link} from 'react-router';

class BidHistory extends React.Component {

  constructor() {
    super();
  }

  render() {
    let bids = this.props.bids.map((bid, index) => {
      return (
        <div key={bid._id} className='list-group-item animated fadeIn'>
          <div className='media'>
            {bid.sequenceNumber} - {bid.amount} - {bid.status} - {bid.timestamp} - {bid.user.name}
          </div>
        </div>
      );
    });

    return (
      <div className='container'>
        <div className='list-group'>
          <div className='panel-heading'>Recent bids</div>
          {bids}
        </div>
      </div>
    );
  }
}

export default BidHistory;
