import React from 'react';
import {Link} from 'react-router';

class VehiclePromoterReschedule extends React.Component {

  constructor() {
    super();
  }

  render() {
    return (
      <button className='btn btn-primary' onClick={this.props.onClickAuctionItemReschedule.bind(this, this.props.auctionItem._id)}>Reschedule</button>
    );
  }
}

export default VehiclePromoterReschedule;
