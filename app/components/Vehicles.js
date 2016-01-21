import React from 'react';
import {Link} from 'react-router';
import {isEqual} from 'underscore';

var Griddle = require('griddle-react');

var Vehicles = React.createClass({
  getInitialState: function() {
    return {vehicles: []};
  },

  componentDidMount: function() {
    $.ajax({
      url: '/api/vehicles',
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({vehicles: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  onRowClick: function (e) {
      this.props.history.pushState(null, '/vehicles/' + e.props.data['_id']);
  },

  render: function () {
    var columns = [
      'title', 'description', 'classification', 'vehicleData.registrationDate'
    ]
    var columnMetadata = [
      {
          'columnName': "title",
          'displayName': "Title",
          'order': 1,
      },
      {
          'columnName': "description",
          'displayName': "Description",
          'order': 2,
      },
      {
          'columnName': "classification",
          'displayName': "Classification",
          'order': 3,
      },
      {
          'columnName': "vehicleData.registrationDate",
          'displayName': "Reg. Date",
          'order': 4,
      }
    ];

    return (
      <div className='container'>
        <div className='list-group'>
          <Griddle
            results={this.state.vehicles}
            columnMetadata={columnMetadata}
            showFilter={true}
            columns={columns}
            onRowClick={this.onRowClick}
            resultsPerPage={25}
          />
        </div>
        Click on vehicle row to view/edit or <Link to='/vehicles/new'>add new vehicle</Link>.
      </div>
    );
  }
});

export default Vehicles;
