import React from 'react';
import {Link} from 'react-router';
import VehicleViewShort from './VehicleViewShort.js';
import NotificationArea from '../../common/NotificationArea.js';

const resetState = {
  vehicles: [],
  notification: null
}

class SellerMyVehicles extends React.Component {

  constructor() {
    super();
    this.state = resetState;
  }

  componentDidMount() {
    var url = '/api/myvehicles';
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

  render() {
    let vehiclesList = this.state.vehicles.map((vehicle, index) => {
      return (
        <div className="list-group-item row" key={vehicle._id}>
          <VehicleViewShort vehicle={vehicle} action='SellerMyVehicles'/>
        </div>
      );
    });

    return (
        <div className='container'>
          <NotificationArea notification={this.state.notification}/>
          <div className='panel panel-default'>
            <div className='panel-heading'>My vehicles</div>
            <div className='panel-body'>
              {vehiclesList}
            </div>
          </div>
        </div>
    );
  }
}

export default SellerMyVehicles;
