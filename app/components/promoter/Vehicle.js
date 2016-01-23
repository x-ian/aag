import React from 'react';
import {Link} from 'react-router';
import VehicleDetails from './VehicleDetails.js';
import PromoterStatus from './PromoterStatus.js';

const resetState = {
    _id: "",
    title: "",
    description: ""
}

class Vehicle extends React.Component {

  constructor() {
    super();
    this.state = resetState;
  }

  componentDidMount() {
    if (this.props.params.id) {
      console.log(this.props.params.id);
      this.setVehicle(this.props.params.id);
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.params.id && prevProps.params.id !== this.props.params.id) {
      this.setVehicle(this.props.params.id)
    }
  }

  setVehicle(id) {
    $.ajax({
      url: '/api/vehicles/' + id,
      dataType: 'json' })
      .done((data) => {
        this.setState(data)
      })
      .fail((jqXhr) => {
        // this.titleValidationState = 'has-error';
        // this.helpBlock = errorMessage;

        // this.actions.getVehicleFail(jqXhr);
      });
  }

  render() {
    return (
      <div className='container'>
        <div className='list-group'>
          <table>
            <tbody>
              <tr>
                <td>
                  Vehicle Details:<br/>
                  <VehicleDetails vehicle={this.state}/>
                </td>
                <td>
                  Status &amp; actions:<br/>
                  <PromoterStatus/>
                </td>
              </tr>
              <tr>
                <td>
                  Bid history:<br/>
                </td>
                <td>
                  Online participants:<br/>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Vehicle;
