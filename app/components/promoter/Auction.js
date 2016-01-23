import React from 'react';
import {Link} from 'react-router';
import {isEqual} from 'underscore';

var Auction = React.createClass({
  getInitialState: function() {
    return {upcomingVehicles: [], closedVehicles: []};
  },
 
  componentDidMount: function() {
    $.ajax({
      url: '/api/vehicles',
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({upcomingVehicles: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
    $.ajax({
      url: '/api/vehicles',
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({closedVehicles: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });

  },

  render: function () {
    let upcomingVehicleList = this.state.upcomingVehicles.map((vehicle, index) => {
      return (
        <div key={vehicle._id} className='list-group-item animated fadeIn'>
          <div className='media'>
            {vehicle._id} - {vehicle.title} - {vehicle.classification} -
            <Link to={'/promoter/vehicles/' + vehicle._id}>Activate</Link>
          </div>
        </div>
      );
    });
    let closedVehicleList = this.state.closedVehicles.map((vehicle, index) => {
      return (
        <div key={vehicle._id} className='list-group-item animated fadeIn'>
          <div className='media'>
            {vehicle._id} - {vehicle.title} - {vehicle.classification} -
          </div>
        </div>
      );
    });

    return (
      <div className='container'>
        <div className='list-group'>
          <div className='panel-heading'>Upcoming Vehicles</div>
          {upcomingVehicleList}

          <div className='panel-heading'>Closed Vehicles</div>
          {closedVehicleList}
        </div>
      </div>
    );
  }
});

export default Auction;
