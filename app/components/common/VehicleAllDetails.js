import React from 'react';
import {Link} from 'react-router';
import {isEqual} from 'underscore';
import MultiLineView from './MultiLineView.js';

class VehicleAllDetails extends React.Component {

  render() {
    return (
      <div className='list-group'>
        <div className='panel-heading'>Vehicle details</div>
        <div key={this.props.vehicle ? this.props.vehicle._id : ''} className='list-group-item animated fadeIn'>

      <ul className="nav nav-tabs" id="myTab">
        <li className="active"><a href="#overview" data-toggle="tab">Overview</a></li>
        <li><a href="#details" data-toggle="tab">Details</a></li>
        <li><a href="#features" data-toggle="tab">Features</a></li>
        <li><a href="#damages" data-toggle="tab">Damages</a></li>
      </ul>

      <div className="tab-content">
			  <div className="tab-pane active" id="overview">
          {this.props.vehicle ? this.props.vehicle.title : ''} <br/>
          {this.props.vehicle.registrationDate}<br/>
          {this.props.vehicle.powerOutputPs} PS<br/>
          {this.props.vehicle.odometerKm} km<br/><br/>
          <MultiLineView text={this.props.vehicle.description}/>
			  </div>
			  <div className="tab-pane" id="details">
          {this.props.vehicle.brand}<br/>
          {this.props.vehicle.classification}<br/>
          {this.props.vehicle.model}<br/>
          {this.props.vehicle.transmission}<br/>
          {this.props.vehicle.fuelType}<br/>
          {this.props.vehicle.cubicCapacityCcm} ccm
			  </div>
			  <div className="tab-pane" id="features">
          <MultiLineView text={this.props.vehicle.features}/>
        </div>
			  <div className="tab-pane" id="damages">
          <MultiLineView text={this.props.vehicle.damages}/>
        </div>
			</div>

          </div>
        </div>
    );
  }

};

export default VehicleAllDetails;
