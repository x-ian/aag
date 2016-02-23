import React from 'react';
import {Link} from 'react-router';
import {isEqual} from 'underscore';

var Griddle = require('griddle-react');

var Users = React.createClass({
  getInitialState: function() {
    return {users: []};
  },

  componentDidMount: function() {
    $.ajax({
      url: '/api/users',
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({users: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  onRowClick: function (e) {
      this.props.history.pushState(null, '/users/' + e.props.data['_id']);
  },

  render: function () {
    var columns = [
      'name', 'email', 'deactivated', 'isSeller', 'isBuyer', 'isPromoter'
    ]
    var columnMetadata = [
      {
          'columnName': "name",
          'displayName': "Name",
          'order': 1,
      },
      {
          'columnName': "email",
          'displayName': "Email",
          'order': 2,
      },
      {
          'columnName': "deactivated",
          'displayName': "Deactivated",
          'order': 3,
      },
      {
          'columnName': "isSeller",
          'displayName': "Seller",
          'order': 4,
      },
      {
          'columnName': "isBuyer",
          'displayName': "Buyer",
          'order': 5,
      },
      {
          'columnName': "isPromoter",
          'displayName': "Promoter",
          'order': 6,
      }
    ];

    return (
      <div className='container'>
        <div className='list-group'>
          <Griddle
            results={this.state.users}
            columnMetadata={columnMetadata}
            showFilter={true}
            columns={columns}
            onRowClick={this.onRowClick}
            resultsPerPage={25}
          />
        </div>
        Click on user row to view/edit or <Link to='/users/new'>add new user</Link>.
      </div>
    );
  }
});

export default Users;
