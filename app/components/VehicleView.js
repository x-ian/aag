import React from 'react';
import {Link} from 'react-router';
import _ from "underscore";
var ImageGallery = require('react-image-gallery');

const resetState = {
  vehicle: {
    _id: null,
    title: "",
    description: "",
    brand: "",
    model: "",
    classification: "",
    features: "",
    damages: "",
    images: [{original: "", thumbnail: ""}],
    powerOutputPs: "",
    cubicCapacity: "",
    transmission: "",
    fuelType: "",
    registrationDate: "",
    odometerKm: ""
  }
}

class VehicleView extends React.Component {

  constructor() {
    super();
    this.state = resetState;
  }

  componentDidMount() {
    if (this.props.params.id) {
      this.setVehicle(this.props.params.id);
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.params.id && prevProps.params.id !== this.props.params.id) {
      this.setVehicle(this.props.params.id)
    }
  }

  onClickBuyNow(event) {
    event.preventDefault();

    $.ajax({
      url: '/api/vehiclesfull/' + this.state.vehicle._id,
      dataType: 'json',
      type: 'DELETE'
    }).done((data) => {
      // doesnt seem right, but dont know how else to get back to the list after successful add
      setTimeout(function(){
        this.props.history.pushState(null, '/vehicles');
      }.bind(this), 1000);
      this.setState(resetState);
    }).fail((jqXhr) => {
      console.log('ERROR: ' + jqXhr);
    });
  }

  onClickCancel(event) {
    event.preventDefault();
    this.setState(resetState);
    this.props.history.pushState(null, '/vehicles');
  }

  setVehicle(id) {
    this.setState(resetState);
    $.ajax({
      url: '/api/vehiclesfull/' + id,
      dataType: 'json'
    }).done((data) => {
      this.setState({vehicle: data.vehicle});
    }).fail((jqXhr) => {
      console.log('ERROR: ' + jqXhr);
    });
  }

  handleSlide(index) {
    // console.log('Slid to ' + index);
  }

  render() {

    return (
        <div className='container'>

          <div className='panel panel-default'>
            <div className='panel-heading'>View Vehicle</div>
            <div className='panel-body'>
              <div className="row">
                <div className="col-sm-6">
                  <ImageGallery
                    items={this.state.vehicle.images}
                    autoPlay={true}
                    slideInterval={5000}
                    onSlide={this.handleSlide}
                  />
                </div>
                <div className="col-sm-6">
                  {this.state.vehicle.title}<br/>
                  {this.state.vehicle.registrationDate}<br/>
                  {this.state.vehicle.powerOutputPs} PS<br/>
                  {this.state.vehicle.odometerKm} KM
                </div>
              </div>
              <div className="row">
                <div className="col-sm-3">Additional details</div>
                <div className="col-sm-9">
                  {this.state.vehicle.description}<br/>
                  {this.state.vehicle.brand}<br/>
                  {this.state.vehicle.classification}<br/>
                  {this.state.vehicle.model}<br/>
                  {this.state.vehicle.transmission}<br/>
                  {this.state.vehicle.fuelType}<br/>
                  {this.state.vehicle.cubicCapacity}
                </div>
              </div>
              <div className="row">
                <div className="col-sm-3">Features</div>
                <div className="col-sm-9">
                  {this.state.vehicle.features}
                </div>
              </div>
              <div className="row">
                <div className="col-sm-3">Damages</div>
                <div className="col-sm-9">
                  {this.state.vehicle.damages}
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }
}

export default VehicleView;
