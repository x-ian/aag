import React from 'react';
import {Link} from 'react-router';
import {isEqual} from 'underscore';

class VehicleDetails extends React.Component {

  render() {
    return (
      <div className='container'>
        <div className='list-group'>
          <div className='panel-heading'>Vehicle details</div>
          <div key={this.props.vehicle ? this.props.vehicle._id : ''} className='list-group-item animated fadeIn'>
            <div className='media'>
              {this.props.vehicle ? this.props.vehicle._id : ''} <br/>
              {this.props.vehicle ? this.props.vehicle.title : ''} <br/>
              {this.props.vehicle ? this.props.vehicle.description : ''}
            </div>
          </div>
        </div>
      </div>
    );
  }

};

export default VehicleDetails;
