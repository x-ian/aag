import React from 'react';
import {Link} from 'react-router';
import {isEqual} from 'underscore';

class VehicleDetails extends React.Component {

  render() {
    return (
      <div>
        {this.props.vehicle ? this.props.vehicle._id : ''} <br/>
        {this.props.vehicle ? this.props.vehicle.title : ''} <br/>
        {this.props.vehicle ? this.props.vehicle.description : ''}
      </div>
    );
  }

};

export default VehicleDetails;
