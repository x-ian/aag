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
            {bid.user.name}: {bid.amount} - {bid.status} ({bid.sequenceNumberBase}, {bid.timestamp}, {bid.userIpAddress})
          </div>
        </div>
      );
    });

    return (
        <div className='list-group'>
          <div className='panel-heading'>Recent bids</div>
          {bids}
        </div>
    );
  }
}

export default BidHistory;
