import React from 'react';
import {Link} from 'react-router';
import _ from "underscore";
import InputFormRow from './common/InputFormRow.js';
import TextareaFormRow from './common/TextareaFormRow.js';
import ImageManager from './common/ImageManager.js';

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
    cubicCapacityCcm: "",
    transmission: "",
    fuelType: "",
    registrationDate: "",
    odometerKm: ""
  },

  salesDocument: {
    _id: null,
    buyNowAmount: "",
    auctionStartAmount: "",
    auctionIncrement: "",
    auctionExpectedAmount: "",
    status: "",
    auctionItem: ""
  }
}

class VehicleEdit extends React.Component {

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

  onChange(key, e) {
    // uses computed property names (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#Computed_property_names)
    this.setState({[key]: e.target.value});
  }

  onChangeTitle(e) { this.setState({vehicle: _.extend(this.state.vehicle, { title: e.target.value})}); }
  onChangeDescription(e) { this.setState({vehicle: _.extend(this.state.vehicle, { description: e.target.value})}); }
  onChangeBrand(e) { this.setState({vehicle: _.extend(this.state.vehicle, { brand: e.target.value})}); }
  onChangeModel(e) { this.setState({vehicle: _.extend(this.state.vehicle, { model: e.target.value})}); }
  onChangeClassification(e) { this.setState({vehicle: _.extend(this.state.vehicle, { classification: e.target.value})}); }
  onChangeFeatures(e) { this.setState({vehicle: _.extend(this.state.vehicle, { features: e.target.value})}); }
  onChangeDamages(e) { this.setState({vehicle: _.extend(this.state.vehicle, { damages: e.target.value})}); }
  onChangePowerOutputPs(e) { this.setState({vehicle: _.extend(this.state.vehicle, { powerOutputPs: e.target.value})}); }
  onChangeCubicCapacityCcm(e) { this.setState({vehicle: _.extend(this.state.vehicle, { cubicCapacityCcm: e.target.value})}); }
  onChangeTransmission(e) { this.setState({vehicle: _.extend(this.state.vehicle, { transmission: e.target.value})}); }
  onChangeFuelType(e) { this.setState({vehicle: _.extend(this.state.vehicle, { fuelType: e.target.value})}); }
  onChangeRegistrationDate(e) { this.setState({vehicle: _.extend(this.state.vehicle, { registrationDate: e.target.value})}); }
  onChangeOdometerKm(e) { this.setState({vehicle: _.extend(this.state.vehicle, { odometerKm: e.target.value})}); }

  onChangeBuyNowAmount(e) { this.setState({salesDocument: _.extend(this.state.salesDocument, { buyNowAmount: e.target.value})}); }
  onChangeAuctionStartAmount(e) { this.setState({salesDocument: _.extend(this.state.salesDocument, { auctionStartAmount: e.target.value})}); }
  onChangeAuctionIncrement(e) { this.setState({salesDocument: _.extend(this.state.salesDocument, { auctionIncrement: e.target.value})}); }
  onChangeAuctionExpectedAmount(e) { this.setState({salesDocument: _.extend(this.state.salesDocument, { auctionExpectedAmount: e.target.value})}); }

  onClickDelete(event) {
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
      if (data.salesDocument) this.setState({salesDocument: data.salesDocument});
    }).fail((jqXhr) => {
      console.log('ERROR: ' + jqXhr);
    });
  }

  addVehicle(vehicle, salesDocument) {
    $.ajax({
      url: '/api/vehiclesfull',
      dataType: 'json',
      type: 'POST',
      data: {
        vehicle: vehicle,
        salesDocument: salesDocument
      }
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

  updateVehicle(vehicle, salesDocument) {
    $.ajax({
      url: '/api/vehiclesfull/' + vehicle._id,
      dataType: 'json',
      type: 'PUT',
      data: {
        vehicle: vehicle,
        salesDocument: salesDocument
      }
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

  handleSubmit(event) {
    event.preventDefault();

    var title = this.state.vehicle.title.trim();

    if (!title) {
      this.titleValidationState = 'has-error';
      this.helpBlock = 'Please enter a title.';
      this.refs.titleTextField.focus();
    }

    if (title) {
      if (this.state.vehicle._id) {
        this.updateVehicle(this.state.vehicle, this.state.salesDocument)
      } else {
        this.addVehicle(this.state.vehicle, this.state.salesDocument);
      }
    }
  }

  render() {

    return (
        <div className='container'>
          <div className='panel panel-default'>
            <div className='panel-heading'>Edit/add Vehicle</div>
            <div className='panel-body'>
              <form onSubmit={this.handleSubmit.bind(this)} className='form-horizontal'>
                <div className="form-group">
                  <label className="col-sm-2 control-label">ID</label>
                  <div className="col-sm-10">
                    <p className="form-control-static">{this.state.vehicle._id}</p>
                  </div>
                </div>

                <InputFormRow
                  label='Title'
                  type='text'
                  value={this.state.vehicle.title}
                  onChange={this.onChangeTitle.bind(this)}/>

                <TextareaFormRow
                  label='Description'
                  value={this.state.vehicle.description}
                  onChange={this.onChangeDescription.bind(this)}/>

                <InputFormRow
                  label='Brand'
                  type='text'
                  value={this.state.vehicle.brand}
                  onChange={this.onChangeBrand.bind(this)}/>

                <InputFormRow
                  label='Classification'
                  type='text'
                  value={this.state.vehicle.classification}
                  onChange={this.onChangeClassification.bind(this)}/>

                <InputFormRow
                  label='Model'
                  type='text'
                  value={this.state.vehicle.model}
                  onChange={this.onChangeModel.bind(this)}/>

                <InputFormRow
                  label='Transmission'
                  type='text'
                  value={this.state.vehicle.transmission}
                  onChange={this.onChangeTransmission.bind(this)}/>

                <InputFormRow
                  label='Fuel type'
                  type='text'
                  value={this.state.vehicle.fuelType}
                  onChange={this.onChangeFuelType.bind(this)}/>

                <InputFormRow
                  label='Power Output (PS)'
                  type='number'
                  value={this.state.vehicle.powerOutputPs}
                  onChange={this.onChangePowerOutputPs.bind(this)}/>

                <InputFormRow
                  label='Cubic capacity'
                  type='number'
                  value={this.state.vehicle.cubicCapacityCcm}
                  onChange={this.onChangeCubicCapacityCcm.bind(this)}/>

                <InputFormRow
                  label='Registration date'
                  type='text'
                  value={this.state.vehicle.registrationDate}
                  onChange={this.onChangeRegistrationDate.bind(this)}/>

                <InputFormRow
                  label='Odometer (KM)'
                  type='number'
                  value={this.state.vehicle.odometerKm}
                  onChange={this.onChangeOdometerKm.bind(this)}/>

                <TextareaFormRow
                  label='Features'
                  value={this.state.vehicle.features}
                  onChange={this.onChangeFeatures.bind(this)}/>

                <TextareaFormRow
                  label='Damages'
                  value={this.state.vehicle.damages}
                  onChange={this.onChangeDamages.bind(this)}/>

                <ImageManager vehicleId={this.state.vehicle._id} images={this.state.vehicle.images}/>

                <div className="panel panel-default">
                  <div className='panel-heading'>Sales document</div>
                  <div className='panel-body'>
                    <InputFormRow
                      label='Buy Now Amount'
                      type='number'
                      value={this.state.salesDocument.buyNowAmount}
                      onChange={this.onChangeBuyNowAmount.bind(this)}/>
                    <InputFormRow
                      label='Start amount'
                      type='number'
                      value={this.state.salesDocument.auctionStartAmount}
                      onChange={this.onChangeAuctionStartAmount.bind(this)}/>
                    <InputFormRow
                      label='Increment by'
                      type='number'
                      value={this.state.salesDocument.auctionIncrement}
                      onChange={this.onChangeAuctionIncrement.bind(this)}/>
                    <InputFormRow
                      label='Minimum expected amount'
                      type='number'
                      value={this.state.salesDocument.auctionExpectedAmount}
                      onChange={this.onChangeAuctionExpectedAmount.bind(this)}/>
                    <div className="form-group">
                      <label className="col-sm-2 control-label">Status</label>
                      <div className="col-sm-10">
                        <p className="form-control-static">{this.state.salesDocument._id}</p>
                      </div>
                    </div>

                  </div>
                </div>

                <div className="form-group">
                   <div className="col-sm-offset-2 col-sm-10">

                    {this.state.vehicle._id ?
                        (
                          <div>
                            <button type='submit' className='btn btn-primary'>Save</button>&nbsp;
                            <button className='btn btn-secondary' onClick={this.onClickDelete.bind(this)}>Delete</button>&nbsp;
                            <button className='btn btn-secondary' onClick={this.onClickCancel.bind(this)}>Cancel</button>
                          </div>
                        )
                      :
                        (
                          <div>
                            <button type='submit' className='btn btn-primary'>Add</button>&nbsp;
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

export default VehicleEdit;
