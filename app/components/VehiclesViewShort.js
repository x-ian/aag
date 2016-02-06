import React from 'react';
import {Link} from 'react-router';

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
        <div className="row" key={vehicle._id}>
          <div className="col-sm-3">
            <Link to={'/vehicles/view/' + vehicle._id}>
              { vehicle.images && vehicle.images[0] ?
                (
                  <img src={vehicle.images[0].thumbnail} style={{width: '150px'}}/>
                ) : (
                  <img src='/img/no-image.png' style={{width: '150px'}}/>
                )
              }
            </Link>
          </div>
          <div className="col-sm-9">
            {vehicle.title}<br/>{vehicle.registrationDate}<br/>{vehicle.powerOutputPs} PS<br/>{vehicle.odometerKm} KM
          </div>
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
