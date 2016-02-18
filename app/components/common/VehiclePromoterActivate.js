import React from 'react';
import {Link} from 'react-router';

class VehiclePromoterActivate extends React.Component {

  constructor() {
    super();
  }

  render() {
    return (
      <button className='btn btn-primary' onClick={this.props.onClickAuctionItemActivate.bind(this, this.props.vehicle._id)}>Activate</button>
    );
  }
}

export default VehiclePromoterActivate;
