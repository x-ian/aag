import React from 'react';
import {Link} from 'react-router';
import {isEqual} from 'underscore';

var Griddle = require('griddle-react');

var Auctions = React.createClass({
  getInitialState: function() {
    return {auctions: []};
  },

  componentDidMount: function() {
    $.ajax({
      url: '/api/auctions',
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({auctions: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  onRowClick: function (e) {
      this.props.history.pushState(null, '/auctions/' + e.props.data['_id']);
  },

  render: function () {
    var columns = [
      'location', 'openAt', 'closeAt'
    ]
    var columnMetadata = [
      {
          'columnName': "location",
          'displayName': "Location",
          'order': 1,
      },
      {
          'columnName': "openAt",
          'displayName': "Open at",
          'order': 2,
      },
      {
          'columnName': "closeAt",
          'displayName': "Close at",
          'order': 3,
      }
    ];

    return (
      <div className='container'>
        <div className='list-group'>
          <Griddle
            results={this.state.auctions}
            columnMetadata={columnMetadata}
            showFilter={true}
            columns={columns}
            onRowClick={this.onRowClick}
            resultsPerPage={25}
          />
        </div>
        Click on auction row to view/edit or <Link to='/auctions/new'>add new auction</Link>.
      </div>
    );
  }
});

export default Auctions;
