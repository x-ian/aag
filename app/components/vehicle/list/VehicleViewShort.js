import React from 'react';
import {Link} from 'react-router';
import MultiLineView from '../../common/MultiLineView.js';

import BuyerAvailableVehicles from '../interactions/BuyerAvailableVehicles.js';
import SellerMyVehicles from '../interactions/SellerMyVehicles.js';

import VehicleSales from '../interactions/VehicleSales.js';
import VehiclePromoterActivate from '../interactions/VehiclePromoterActivate.js';
import VehiclePromoterReschedule from '../interactions/VehiclePromoterReschedule.js';

class VehicleViewShort extends React.Component {

  constructor() {
    super();
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps) {
  }

  render() {
    return (
      <div>
        <div className="col-sm-3">
          <Link to={'/vehicles/view/' + this.props.vehicle._id}>
            { this.props.vehicle.images && this.props.vehicle.images[0] ?
              (
                <img src={this.props.vehicle.images[0].thumbnail} style={{width: '150px'}}/>
              ) : (
                <img src='/img/no-image.png' style={{width: '150px'}}/>
              )
            }
          </Link>
        </div>
        <div className="col-sm-3">
          <strong>{this.props.vehicle.title}</strong><br/>{this.props.vehicle.registrationDate}<br/>{this.props.vehicle.powerOutputPs} PS<br/>{this.props.vehicle.odometerKm} km
        </div>
        <div className="col-sm-4">
          <MultiLineView text={this.props.vehicle.description} maxRows={4} maxChars={150}/>
        </div>
        <div className="col-sm-2">
          { this.props.action === 'BuyerAvailableVehicles' ? <BuyerAvailableVehicles vehicle={this.props.vehicle}/> : '' }

          { this.props.action === 'SellerMyVehicles' ? <SellerMyVehicles vehicle={this.props.vehicle}/> : '' }

          { this.props.action === 'VehicleSales' ? <VehicleSales vehicle={this.props.vehicle}/> : '' }
          { this.props.action === 'VehiclePromoterActivate' ? <VehiclePromoterActivate vehicle={this.props.vehicle} onClickAuctionItemActivate={this.props.onClickAuctionItemActivate}/> : '' }
          { this.props.action === 'VehiclePromoterReschedule' ? <VehiclePromoterReschedule auctionItem={this.props.auctionItem} onClickAuctionItemReschedule={this.props.onClickAuctionItemReschedule}/> : '' }
        </div>
      </div>
    );
  }
}

export default VehicleViewShort;
