import React from 'react';
import {Link} from 'react-router';

const resetState = {
  _id: null,
  openAt: null,
  closeAt: null,
  currentlyActive: false
}

class Start extends React.Component {

  constructor() {
    super();
    this.state = resetState;
  }

  componentDidMount() {
    console.log('didmount');
    this.getNextAuction();
    setInterval(function() { this.getNextAuction(); }.bind(this), 10000);
  }

  componentDidUpdate(prevProps) {
    console.log('didupdate');
    // this.getNextAuction();
  }

  getNextAuction() {
    $.ajax({
      url: '/api/nextauction/',
      dataType: 'json' })
      .done((data) => {
        this.setState(data);
      })
      .fail((jqXhr) => {
        // this.titleValidationState = 'has-error';
        // this.helpBlock = errorMessage;

        // this.actions.getVehicleFail(jqXhr);
      });
  }

  render() {
    var auction = <p>No auction active or scheduled.</p>;
      if (this.state.currentlyActive) {
        auction = <p>Active auction since {this.state.openAt}. Join.</p>
      } else {
        auction = <p>No active auction.<br/>Next scheduled auction starts at {this.state.openAt}</p>
      }

    return (
      <div className='container'>
        <div className='list-group'>
          <br/><br/><br/><br/><br/>
          <div style={{textAlign: 'center'}}>
            <br/><br/><br/>
            {auction}
          </div>
        </div>
      </div>
    );
  }
}

export default Start;
