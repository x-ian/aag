import React from 'react';
import {Link} from 'react-router';

class SellerMyVehicles extends React.Component {

  constructor() {
    super();
  }

  componentDidMount() {
  }

  render() {
    return (
      <div>
        {(() => {
          switch (this.props.vehicle.status) {
            case 'DRAFT':
              return <div>Draft (private)</div>;
            case 'IN_AUCTION':
              return <div>In current auction</div>;
            case 'PUBLISHED':
              if (this.props.vehicle.buyNowAmount > 0)
                return <div>Available for Buy Now { this.props.vehicle.buyNowAmount } and in next auction</div>;
              return <div>Scheduled for next auction</div>;
            case 'SOLD_BUY_NOW':
              return <div>Sold via Buy Now</div>;
            case 'SOLD_AUCTION':
              return <div>Sold via auction</div>;
            case 'SOLD_AUCTION_PENDING_APPROVAL':
              return <div>Sold in auction below expected minimum</div>;
            case 'NOT_SOLD_AUCTION':
              return <div>Not sold in last auction</div>;
            default:
              return <div>Unknown status ({this.props.vehicle.status})</div>;
          }
        })()}
      </div>
    );
  }
}

export default SellerMyVehicles;
