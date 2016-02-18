import React from 'react';
import {Link} from 'react-router';
import MultiLineView from './common/MultiLineView.js';
import VehicleSales from './common/VehicleSales.js';
import VehicleViewShort from './common/VehicleViewShort.js';

const resetState = {
  vehicles: []
}

class VehiclesViewShort extends React.Component {

  constructor() {
    super();
    this.state = resetState;
  }

  componentDidMount() {
    $.ajax({
      url: '/api/vehicles',
      dataType: 'json'
    }).done((data) => {
      this.setState({vehicles: data});
    }).fail((jqXhr) => {
      console.log('ERROR: ' + jqXhr);
    });
  }

  componentDidUpdate(prevProps) {
  }

  setVehicles() {
    $.ajax({
      url: '/api/vehicles',
      dataType: 'json'
    }).done((data) => {
      this.setState({vehicles: data});
    }).fail((jqXhr) => {
      console.log('ERROR: ' + jqXhr);
    });
  }

  render() {
    let vehiclesList = this.state.vehicles.map((vehicle, index) => {
      return (
        <div className="list-group-item row" key={vehicle._id}>
          <VehicleViewShort vehicle={vehicle} action='VehicleSales'/>
        </div>
      );
    });

    return (
        <div className='container'>
          <div className='panel panel-default'>
            <div className='panel-heading'>Upcoming vehicles</div>
            <div className='panel-body'>
              {vehiclesList}
            </div>
          </div>
        </div>
    );
  }
}

export default VehiclesViewShort;
