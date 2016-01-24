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
    this.getNextAuction();
    this.interval = setInterval(function() { this.getNextAuction(); }.bind(this), 10000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentDidUpdate(prevProps) {
    // if (this.props.params.id && prevProps.params.id !== this.props.params.id) {
    //   this.getNextAuction();
    // }
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

  onClickJoin(event) {
    event.preventDefault();
    this.props.history.pushState(null, '/auction/index');
  }


  render() {
    var auction = <p>No auction active or scheduled.</p>;
      if (this.state.currentlyActive) {
        auction = <p>Active auction since {this.state.openAt}. <button className='btn btn-secondary' onClick={this.onClickJoin.bind(this)}>Join</button></p>
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
