import React from 'react';
import {Link} from 'react-router';
import VehiclesViewShort from '../VehiclesViewShort.js';

const resetState = {
  _id: null,
  location: null,
  scheduledAt: null,
  closedAt: null,
  active: false
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
      dataType: 'json'
    }).done((data) => {
      if (data) {
        this.setState(data);
      } else {
        this.setState(resetState);
      }
    }).fail((jqXhr) => {
      console.log("ERROR " + jqXhr);
    });
  }

  onClickJoin(event) {
    event.preventDefault();
    this.props.history.pushState(null, '/bidder/auction/' + this.state._id);
  }

  render() {
    var auction = <h3 className='text-center'>No current or scheduled auction</h3>;
    if (this.state.active) {
      auction = <div>
        <h3 className='text-center'>Active auction in {this.state.location} since {this.state.scheduledAt}</h3>
        <p className='text-center'><button className='btn btn-primary' onClick={this.onClickJoin.bind(this)}>Join</button></p>
      </div>;
    } else if (this.state._id ){
      auction = <div>
        <h3 className='text-center'>Currently no active auction</h3>
        <p className='text-center'>Next scheduled auction starts in {this.state.location} at {this.state.scheduledAt}</p>
      </div>;
    }

    return (
      <div>
        <div className='container'>
          <br/><br/><br/>
          {auction}
          <br/><br/>
        </div>
        <div className='container'>
          <VehiclesViewShort/>
        </div>
      </div>
    );
  }
}

export default Start;
