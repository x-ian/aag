import React from 'react';
import {Link} from 'react-router';
import AuctionVehicle from './AuctionVehicle.js';

const resetState = {
  vehicle: null,
  id: "",
  title: "",
  description: ""
}

class AuctionOverview extends React.Component {

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
        this.setState({
          vehicle: data['vehicle'],
          id: data['vehicle']._id,
          title: data['vehicle'].title,
          description: data['vehicle'].description
        });
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
                  <PromoterVehicleDetails vehicle={this.state.vehicle}/>
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

export default AuctionOverview;
