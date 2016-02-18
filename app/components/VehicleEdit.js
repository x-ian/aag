import React from 'react';
import {Link} from 'react-router';
import _ from "underscore";
import InputFormRow from './common/InputFormRow.js';
import TextareaFormRow from './common/TextareaFormRow.js';
import ImageManager from './common/ImageManager.js';
import SelectInput from './common/SelectInput.js';

const resetState = {
  vehicle: {
    _id: null,
    title: "",
    description: "",
    // modelData
    brand: "",
    model: "",
    classification: "",
    powerOutputPs: "",
    cubicCapacityCcm: "",
    transmission: "",
    fuelType: "",
    // vehicleData
    features: "",
    damages: "",
    images: [{original: "", thumbnail: ""}],
    registrationDate: "",
    odometerKm: "",
    // salesData
    buyNowAmount: "",
    auctionStartAmount: "",
    auctionIncrement: "",
    auctionExpectedAmount: "",
    status: "DRAFT",
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
  onChangeTransmission(e) { this.setState({vehicle: _.extend(this.state.vehicle, { transmission: e.value})}); }
  onChangeFuelType(e) { this.setState({vehicle: _.extend(this.state.vehicle, { fuelType: e.value})}); }
  onChangeRegistrationDate(e) { this.setState({vehicle: _.extend(this.state.vehicle, { registrationDate: e.target.value})}); }
  onChangeOdometerKm(e) { this.setState({vehicle: _.extend(this.state.vehicle, { odometerKm: e.target.value})}); }
  // salesData
  onChangeBuyNowAmount(e) { this.setState({vehicle: _.extend(this.state.vehicle, { buyNowAmount: e.target.value})}); }
  onChangeAuctionStartAmount(e) { this.setState({vehicle: _.extend(this.state.vehicle, { auctionStartAmount: e.target.value})}); }
  onChangeAuctionIncrement(e) { this.setState({vehicle: _.extend(this.state.vehicle, { auctionIncrement: e.target.value})}); }
  onChangeAuctionExpectedAmount(e) { this.setState({vehicle: _.extend(this.state.vehicle, { auctionExpectedAmount: e.target.value})}); }
  onChangeStatus(e) { this.setState({vehicle: _.extend(this.state.vehicle, { status: e.value })}); }

  onClickDelete(event) {
    event.preventDefault();

    $.ajax({
      url: '/api/vehiclesfull/' + this.state.vehicle._id,
      dataType: 'json',
      type: 'DELETE'
    }).done((data) => {
      // doesnt seem right, but dont know how else to get back to the list after successful add
      this.setState(resetState);
      setTimeout(function(){
        this.props.history.pushState(null, '/vehicles');
      }.bind(this), 1000);
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
      url: '/api/vehicles/' + id,
      dataType: 'json'
    }).done((data) => {
      this.setState({vehicle: data});
    }).fail((jqXhr) => {
      console.log('ERROR: ' + jqXhr);
    });
  }

  addVehicle(vehicle, salesInformation) {
    $.ajax({
      url: '/api/vehicles',
      dataType: 'json',
      type: 'POST',
      data: vehicle
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

  updateVehicle(vehicle) {
    $.ajax({
      url: '/api/vehicles/' + vehicle._id,
      dataType: 'json',
      type: 'PUT',
      data: vehicle
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
        this.updateVehicle(this.state.vehicle)
      } else {
        this.addVehicle(this.state.vehicle);
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

                <div className="panel panel-default">
                  <div className='panel-heading'>Model data</div>
                  <div className='panel-body'>
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

                    <div className="form-group">
                      <label className="col-sm-2 control-label">Transmission</label>
                      <div className="col-sm-10">
                        <SelectInput
                          name="selectInputTransmission"
                          value={this.state.vehicle.transmission}
                          options={[
                            { value: 'MANUAL', label: 'Manual' },
                            { value: 'AUTOMATIC', label: 'Automatic' },
                            { value: 'SEMI_AUTOMATIC', label: 'Semi automatic' },
                            { value: 'TIPTRONIC', label: 'TipTronic' },
                            { value: 'OTHER_UNKNOWN', label: 'Other/unknown' }]}
                          onChange={this.onChangeTransmission.bind(this)}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="col-sm-2 control-label">Fuel type</label>
                      <div className="col-sm-10">
                        <SelectInput
                          name="selectInputFuelType"
                          value={this.state.vehicle.fuelType}
                          options={[
                            { value: 'PETROL', label: 'Petrol' },
                            { value: 'DIESEL', label: 'Diesel' },
                            { value: 'BIO_DIESEL', label: 'Bio diesel' },
                            { value: 'ELETRIC', label: 'Electric' },
                            { value: 'TWO_STROKE', label: 'Two-stroke mixture' },
                            { value: 'OTHER_UNKNOWN', label: 'Other/unknown' }]}
                          onChange={this.onChangeFuelType.bind(this)}
                        />
                      </div>
                    </div>

                    <InputFormRow
                      label='Power Output (PS)'
                      type='number'
                      value={this.state.vehicle.powerOutputPs}
                      onChange={this.onChangePowerOutputPs.bind(this)}/>

                    <InputFormRow
                      label='Cubic capacity (ccm)'
                      type='number'
                      value={this.state.vehicle.cubicCapacityCcm}
                      onChange={this.onChangeCubicCapacityCcm.bind(this)}/>
                  </div>
                </div>

                <div className="panel panel-default">
                  <div className='panel-heading'>Vehicle data</div>
                  <div className='panel-body'>
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
                  </div>
                </div>

                <div className="panel panel-default">
                  <div className='panel-heading'>Sales data</div>
                  <div className='panel-body'>
                    <InputFormRow
                      label='Buy Now Amount (empty for no Buy now)'
                      type='number'
                      value={this.state.vehicle.buyNowAmount}
                      onChange={this.onChangeBuyNowAmount.bind(this)}/>
                    <InputFormRow
                      label='Auction Start amount'
                      type='number'
                      value={this.state.vehicle.auctionStartAmount}
                      onChange={this.onChangeAuctionStartAmount.bind(this)}/>
                    <InputFormRow
                      label='Auction Increment by'
                      type='number'
                      value={this.state.vehicle.auctionIncrement}
                      onChange={this.onChangeAuctionIncrement.bind(this)}/>
                    <InputFormRow
                      label='Auction Minimum expected amount'
                      type='number'
                      value={this.state.vehicle.auctionExpectedAmount}
                      onChange={this.onChangeAuctionExpectedAmount.bind(this)}/>

                    <div className="form-group">
                      <label className="col-sm-2 control-label">Status</label>
                      <div className="col-sm-10">
                        <SelectInput
                          name="selectInputStatus"
                          clearable={false}
                          value={this.state.vehicle.status}
                          options={[
                            { value: 'DRAFT', label: 'Draft' },
                            { value: 'PUBLISHED', label: 'Published (waiting for next auction)' },
                            { value: 'IN_AUCTION', label: 'Currently in auction' },
                            { value: 'SOLD_BUY_NOW', label: 'Sold from Buy now' },
                            { value: 'SOLD_AUCTION', label: 'Sold in auction' }]}
                          onChange={this.onChangeStatus.bind(this)}
                        />
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
