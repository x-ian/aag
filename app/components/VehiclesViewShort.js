import React from 'react';
import {Link} from 'react-router';
import MultiLineView from './common/MultiLineView.js';
import VehicleSales from './common/VehicleSales.js';
import VehicleViewShort from './common/VehicleViewShort.js';
import NotificationArea from './common/NotificationArea.js';

const resetState = {
  vehicles: [],
  notification: null
}

class VehiclesViewShort extends React.Component {

  constructor() {
    super();
    this.state = resetState;
  }

  componentDidMount() {
    var url = '/api/vehicles';
    if (this.props.myVehicles) url = '/api/myvehicles';
    $.ajax({
      url: url,
      dataType: 'json'
    }).done((data) => {
      this.setState({vehicles: data});
    }).fail((jqXhr) => {
      console.log('ERROR: ' + jqXhr);
      var n = {errors: [jqXhr.responseText]};
      if (jqXhr.responseJSON) {
        n = {errors: [jqXhr.responseJSON.message + ' (' + jqXhr.statusText + ')']};
      }
      this.setState({notification: n});
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
          <NotificationArea notification={this.state.notification}/>
          <div className='panel panel-default'>
            <div className='panel-heading'>{this.props.myVehicles ? 'My vehicles' : 'Upcoming vehicles'}</div>
            <div className='panel-body'>
              {vehiclesList}
            </div>
          </div>
        </div>
    );
  }
}

export default VehiclesViewShort;
