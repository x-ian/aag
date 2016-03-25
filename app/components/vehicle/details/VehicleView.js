import React from 'react';
import {Link} from 'react-router';
import _ from "underscore";
var ImageGallery = require('react-image-gallery');
import MultiLineView from '../../common/MultiLineView.js';
import VehicleSales from '../interactions/VehicleSales.js';

const resetState = {
  vehicle: {
    _id: null,
    title: "",
    description: "",
    seller: "",
    brand: "",
    model: "",
    classification: "",
    features: "",
    damages: "",
    images: [{original: "", thumbnail: ""}],
    powerOutputPs: "",
    cubicCapacityCcm: "",
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

  onClickContactSeller(event) {
    event.preventDefault();

    var link = "mailto:info@auto-auction-germany.com"
    //     + "?cc=myCCaddress@example.com"
         + "?subject=" + escape("Vehicle inquiry for vehicle " + this.state.vehicle._id)
    //     + "&body=" + escape(document.getElementById('myText').value)
         ;

         window.location.href = link;
  }

  onClickCancel(event) {
    event.preventDefault();
    this.setState(resetState);
    window.history.back();
  }

  onClickEdit(event) {
    event.preventDefault();
    this.props.history.pushState(null, '/vehicles/' + this.state.vehicle._id);
  }

  setVehicle(id) {
    this.setState(resetState);
    $.ajax({
      url: '/api/vehicles/' + id,
      dataType: 'json'
    }).done((data) => {
      this.setState({vehicle: data});
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
            <div className='panel-heading'>View Vehicle: {this.state.vehicle.title}</div>
            <div className='panel-body'>
              <div className="row">
                <div className="col-sm-6">
                  { this.state.vehicle.images && this.state.vehicle.images[0] ?
                    (

                      <ImageGallery
                        items={this.state.vehicle.images}
                        autoPlay={true}
                        slideInterval={5000}
                        onSlide={this.handleSlide}
                      />
                    ) : (
                      <img src='/img/no-image.png' style={{width: '300px'}}/>
                    )
                  }
                </div>
                <div className="col-sm-6">
                  <VehicleSales vehicle={this.state.vehicle}/><br/>
                  {this.state.vehicle.registrationDate}<br/>
                  {this.state.vehicle.powerOutputPs} PS<br/>
                  {this.state.vehicle.odometerKm} km<br/><br/>
                  <MultiLineView text={this.state.vehicle.description}/>
                </div>
              </div>
              <hr/>
              <div className="row">
                <div className="col-sm-3">Additional details</div>
                <div className="col-sm-9">
                  {this.state.vehicle.brand}<br/>
                  {this.state.vehicle.classification}<br/>
                  {this.state.vehicle.model}<br/>
                  {this.state.vehicle.transmission}<br/>
                  {this.state.vehicle.fuelType}<br/>
                  {this.state.vehicle.cubicCapacityCcm} ccm
                </div>
              </div>
              <hr/>
              <div className="row">
                <div className="col-sm-3">Features</div>
                <div className="col-sm-9">
                  <MultiLineView text={this.state.vehicle.features}/>
                </div>
              </div>
              <hr/>
              <div className="row">
                <div className="col-sm-3">Damages</div>
                <div className="col-sm-9">
                  <MultiLineView text={this.state.vehicle.damages}/>
                </div>
              </div>
              <hr/>
              <div className="row">
                <div className="col-sm-3">Sales</div>
                <div className="col-sm-9">
                  <VehicleSales vehicle={this.state.vehicle}/>
                </div>
              </div>
              <hr/>
              <button className='btn btn-secondary' onClick={this.onClickCancel.bind(this)}>Cancel</button>&nbsp;
              <button className='btn btn-secondary' onClick={this.onClickContactSeller.bind(this)}>Contact seller</button>&nbsp;
              <button className='btn btn-secondary' onClick={this.onClickEdit.bind(this)}>Edit</button>
            </div>
          </div>
        </div>
    );
  }
}

export default VehicleView;
