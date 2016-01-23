import React from 'react';
import {Link} from 'react-router';

import moment from "moment";
import DateTimeField from "react-bootstrap-datetimepicker";
require('react-datetime');
import DateTime from 'react-datetime';

const resetState = {
  _id: "",
  openAt: null,
  closeAt: null,
  location: null
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

  onChangeOpenAt(e) { this.setState({openAt: e}) }

  onChangeCloseAt(e) { this.setState({closeAt: e}) }

  onClickDelete(event) {
    event.preventDefault();

    $.ajax({
      url: '/api/auctions/' + this.state._id,
      dataType: 'json',
      type: 'DELETE'})
      .done((data) => {
         console.log('ok');
         // doesnt seem right, but dont know how else to get back to the list after successful add
           setTimeout(function(){
             this.props.history.pushState(null, '/auctions');
           }.bind(this), 1000);
           this.setState(resetState);
       })
       .fail((jqXhr) => {
         console.log('nok ');
      //   //  this.actions.addVehicleFail(jqXhr.responseJSON.message);
      });

  }

  onClickCancel(event) {
    event.preventDefault();
    this.setState(resetState);
    this.props.history.pushState(null, '/auctions');
  }

  setAuction(id) {
    $.ajax({
      url: '/api/auctions/' + id,
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

  addAuction(openAt, closeAt, location) {
    $.ajax({
      url: '/api/auctions',
      dataType: 'json',
      type: 'POST',
      data: {
          openAt: openAt,
          closeAt: closeAt,
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
        //  this.actions.addVehicleFail(jqXhr.responseJSON.message);
       });
  }

  updateAuction(id, openAt, closeAt, location) {
    $.ajax({id,
      url: '/api/auctions/' + id,
      dataType: 'json',
      type: 'PUT',
      data: {
          id: id,
          openAt: openAt,
          closeAt: closeAt,
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
        //  this.actions.addVehicleFail(jqXhr.responseJSON.message);
       });
  }

  handleSubmit(event) {
    event.preventDefault();

    var openAt = this.state.openAt;
    var closeAt = this.state.closeAt;
    var location = this.state.location;

    if (!openAt) {
      this.openAtValidationState = 'has-error';
      this.helpBlock = 'Please enter a start date.';
      //this.refs.openAtTextField.focus();
    }

    if (openAt) {
      if (this.state.id) {
        this.updateAuction(this.state._id, openAt, closeAt, location)
      } else {
        this.addAuction(openAt, closeAt, location);
      }
    }
  }

  render() {
    return (
      <div className="auctionBox">
        <div className='container'>
          <div className='row flipInX animated'>
            <div className='col-sm-8'>
              <div className='panel panel-default'>
                <div className='panel-heading'>View/edit/add Auction</div>
                <div className='panel-body'>
                <form onSubmit={this.handleSubmit.bind(this)}>
                  <table><tbody>
                <tr>
                    <td>
                      <label className='control-label'>ID</label>
                    </td><td>
                      {this.state._id}
                    </td>
                  </tr><tr>
                    <td>
                      <label className='control-label'>Location</label>
                    </td><td>
                      <input type='text' className='form-control' ref='locationTextField' value={this.state.location}
                        onChange={this.onChangeLocation.bind(this)} autoFocus/>
                    </td>
                  </tr><tr>
                    <td>
                      <label className='control-label'>Open At</label>
                    </td><td>
                      <DateTime
                          ref='openAtDateField'
                           inputFormat='DD/MM/YYYY HHmm'
                            value={this.state.openAt}
                          onChange={this.onChangeOpenAt.bind(this)}
                        />
                      <span className='help-block'>{this.state.helpBlock}</span>
                    </td>
                  </tr><tr>
                    <td>
                      <label className='control-label'>Close At</label>
                    </td><td>
                    <DateTimeField
                        ref='closeAtDateField'
                         inputFormat='DD/MM/YYYY HHmm'
                        onChange={this.onChangeCloseAt.bind(this)}
                      />
                   </td>
                  </tr>
                  </tbody></table>

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

                </form>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Auction;
