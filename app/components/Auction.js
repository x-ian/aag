import React from 'react';
import {Link} from 'react-router';

import DateTimeSelect from './common/DateTimeSelect.js'

const resetState = {
  _id: "",
  scheduledAt: null,
  closedAt: null,
  location: null,
  active: null
}

class Auction extends React.Component {

  constructor() {
    super();
    this.state = resetState;
  }

  componentDidMount() {
    if (this.props.params.id) {
      this.setAuction(this.props.params.id);
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.params.id && prevProps.params.id !== this.props.params.id) {
      this.setAuction(this.props.params.id)
    }
  }

  onChangeLocation(e) { this.setState({location: e.target.value}) }

  onChangeActive(e) {
    this.setState({active: e.target.checked});
   }

  onChangeScheduledAt(e) { (e === 'Invalid date') ? this.setState({closedAt: ''}) : this.setState({scheduledAt: e}) }

  onChangeClosedAt(e) { (e === 'Invalid date') ? this.setState({closedAt: ''}) : this.setState({closedAt: e}); }

  onClickDelete(event) {
    event.preventDefault();

    $.ajax({
      url: '/api/auctions/' + this.state._id,
      dataType: 'json',
      type: 'DELETE'})
      .done((data) => {
         // doesnt seem right, but dont know how else to get back to the list after successful add
           setTimeout(function(){
             this.props.history.pushState(null, '/auctions');
           }.bind(this), 1000);
           this.setState(resetState);
       })
       .fail((jqXhr) => {
         console.log('ERROR: ' + jqXhr);
      });
  }

  onClickCancel(event) {
    event.preventDefault();
    this.setState(resetState);
    this.props.history.pushState(null, '/auctions');
  }

  onClickStart(event) {
    event.preventDefault();

    $.ajax({
      url: '/api/auctions/' + this.state._id,
      dataType: 'json',
      type: 'DELETE'})
      .done((data) => {
         // doesnt seem right, but dont know how else to get back to the list after successful add
           setTimeout(function(){
             this.props.history.pushState(null, '/auctions');
           }.bind(this), 1000);
           this.setState(resetState);
       })
       .fail((jqXhr) => {
         console.log('ERROR: ' + jqXhr);
      });
  }

  setAuction(id) {
    $.ajax({
      url: '/api/auctions/' + id,
      dataType: 'json' })
      .done((data) => {
        this.setState(data);
      })
      .fail((jqXhr) => {
        console.log('ERROR: ' + jqXhr);
      });
  }

  addAuction(scheduledAt, closedAt, location, active) {
    $.ajax({
      url: '/api/auctions',
      dataType: 'json',
      type: 'POST',
      data: {
          scheduledAt: scheduledAt,
          closedAt: closedAt,
          active: active,
          location: location
        }
       })
       .done((data) => {
        //  this.actions.addVehicleSuccess(data.message);
         // doesnt seem right, but dont know how else to get back to the list after successful add
           setTimeout(function(){
             this.props.history.pushState(null, '/auctions');
           }.bind(this), 1000);
           this.setState(resetState);
       })
       .fail((jqXhr) => {
         console.log('ERROR: ' + jqXhr);
       });
  }

  updateAuction(id, scheduledAt, closedAt, location, active) {
    $.ajax({id,
      url: '/api/auctions/' + id,
      dataType: 'json',
      type: 'PUT',
      data: {
          id: id,
          scheduledAt: scheduledAt,
          closedAt: closedAt,
          active: active,
          location: location
        }
       })
       .done((data) => {
        //  this.actions.addVehicleSuccess(data.message);
         // doesnt seem right, but dont know how else to get back to the list after successful add
           setTimeout(function(){
             this.props.history.pushState(null, '/auctions');
           }.bind(this), 1000);
           this.setState(resetState);
       })
       .fail((jqXhr) => {
         console.log('ERROR: ' + jqXhr);
       });
  }

  handleSubmit(event) {
    event.preventDefault();

    var scheduledAt = this.state.scheduledAt;
    var closedAt = this.state.closedAt;
    var active = this.state.active;
    var location = this.state.location;

    if (!scheduledAt) {
      this.scheduledAtValidationState = 'has-error';
      this.helpBlock = 'Please enter a start date.';
      //this.refs.openAtTextField.focus();
    }

    if (scheduledAt) {
      if (this.state._id) {
        this.updateAuction(this.state._id, scheduledAt, closedAt, location, active)
      } else {
        this.addAuction(scheduledAt, closedAt, location, active);
      }
    }
  }

  render() {
    return (
      <div className="container">
        <div className='panel panel-default'>
          <div className='panel-heading'>View/edit/add Auction</div>
          <div className='panel-body'>
            <form onSubmit={this.handleSubmit.bind(this)} className='form-horizontal'>
              <div className="form-group">
                <label className="col-sm-2 control-label">ID</label>
                <div className="col-sm-10">
                  <p className="form-control-static">{this.state._id}</p>
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-2 control-label">Location</label>
                <div className="col-sm-10">
{/*
                    <input type='text' className='form-control' ref='locationTextField' value={this.state.location}
                    onChange={this.onChangeLocation.bind(this)} autoFocus/>
*/}

                  <select value={this.state.location} className="form-control" ref='locationSelect' onChange={this.onChangeLocation.bind(this)} >
                    <option value=""></option>
                    <option value="Kaiserslautern">Kaiserslautern</option>
                    <option value="Nierstein">Nierstein</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-2 control-label">Scheduled at</label>
                <div className="col-sm-10">
                  <DateTimeSelect onChange={this.onChangeScheduledAt.bind(this)} dateTime={this.state.scheduledAt} ref='scheduledAtDateField'/>
                {/*
                  <input type='text' className='form-control' ref='openAtTextField' value={this.state.openAt}
                    onChange={this.onChangeOpenAt.bind(this)} autoFocus/>
                */}
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-2 control-label">Currently active</label>
                <div className="col-sm-10">
                  <div className="checkbox">
                    <label>
                      <input type="checkbox" onChange={this.onChangeActive.bind(this)} checked={this.state.active}/>
                    </label>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-2 control-label">Closed at</label>
                <div className="col-sm-10">
                  <DateTimeSelect onChange={this.onChangeClosedAt.bind(this)} dateTime={this.state.closedAt} ref='closedAtDateField'/>
                  {/*
                    <input type='text' className='form-control' ref='closeAtTextField' value={this.state.closeAt}
                    onChange={this.onChangeCloseAt.bind(this)} autoFocus/>
                */}
                </div>
              </div>

              <div className="form-group">
                 <div className="col-sm-offset-2 col-sm-10">

                  {this.state._id ?
                    (
                      <div>
                        <button type='submit' className='btn btn-primary'>Save</button>
                        <button className='btn btn-secondary' onClick={this.onClickDelete.bind(this)}>Delete</button>
                        <button className='btn btn-secondary' onClick={this.onClickCancel.bind(this)}>Cancel</button>
                      </div>
                    )
                  :
                    (
                      <div>
                        <button type='submit' className='btn btn-primary'>Add</button>
                        <button className='btn btn-secondary' onClick={this.onClickCancel.bind(this)}>Cancel</button>
                      </div>
                    )
                  }
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Auction;
