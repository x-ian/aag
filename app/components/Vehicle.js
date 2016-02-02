import React from 'react';
import {Link} from 'react-router';

const resetState = {
    _id: "",
    title: "",
    description: "",
    auctionItemStartAmount: "",
    auctionItemIncrementBy: ""
}

class Vehicle extends React.Component {

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

  onChangeTitle(e) { this.setState({title: e.target.value}) }

  onChangeDescription(e) { this.setState({description: e.target.value}) }

  onChangeStartAmount(e) { this.setState({auctionItemStartAmount: e.target.value}) }

  onChangeIncrementBy(e) { this.setState({auctionItemIncrementBy: e.target.value}) }

  onClickDelete(event) {
    event.preventDefault();

    $.ajax({
      url: '/api/vehicles/' + this.state._id,
      dataType: 'json',
      type: 'DELETE'
    }).done((data) => {
      //  this.actions.addVehicleSuccess(data.message);
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
    $.ajax({
      url: '/api/vehicles/' + id,
      dataType: 'json'
    }).done((data) => {
        this.setState(data);
    }).fail((jqXhr) => {
      console.log('ERROR: ' + jqXhr);
    });
  }

  addVehicle(title, description, startAmount, incrementBy) {
    $.ajax({
      url: '/api/vehicles',
      dataType: 'json',
      type: 'POST',
      data: {
          title: title,
          description: description,
          auctionItemStartAmount: startAmount,
          auctionItemIncrementBy: incrementBy
      }
    }).done((data) => {
        //  this.actions.addVehicleSuccess(data.message);
         // doesnt seem right, but dont know how else to get back to the list after successful add
      setTimeout(function(){
        this.props.history.pushState(null, '/vehicles');
      }.bind(this), 1000);
      this.setState(resetState);
    }).fail((jqXhr) => {
      console.log('ERROR: ' + jqXhr);
    });
  }

  updateVehicle(id, title, description) {
    $.ajax({id,
      url: '/api/vehicles/' + id,
      dataType: 'json',
      type: 'PUT',
      data: {
          id: id,
          title: title,
          description: description,
          auctionItemStartAmount: startAmount,
          auctionItemIncrementBy: incrementBy
        }
       }).done((data) => {
        //  this.actions.addVehicleSuccess(data.message);
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

    var title = this.state.title.trim();
    var description = this.state.description.trim();
    var startAmount = this.state.auctionItemStartAmount.trim();
    var incrementBy = this.state.auctionItemIncrementBy.trim();

    if (!title) {
      this.titleValidationState = 'has-error';
      this.helpBlock = 'Please enter a title.';
      this.refs.titleTextField.focus();
    }

    if (title) {
      if (this.state._id) {
        this.updateVehicle(this.state._id, title, description, startAmount, incrementBy)
      } else {
        this.addVehicle(title, description, startAmount, incrementBy);
      }
    }
  }

  render() {
    return (
        <div className='container'>
          <div className='panel panel-default'>
            <div className='panel-heading'>View/edit/add Vehicle</div>
            <div className='panel-body'>
              <form onSubmit={this.handleSubmit.bind(this)} className='form-horizontal'>
                <div className="form-group">
                  <label className="col-sm-2 control-label">ID</label>
                  <div className="col-sm-10">
                    <p className="form-control-static">{this.state._id}</p>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label">Title</label>
                  <div className="col-sm-10">
                    <input type='text' className='form-control' ref='titleTextField' value={this.state.title}
                        onChange={this.onChangeTitle.bind(this)} autoFocus/>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label">Description</label>
                  <div className="col-sm-10">
                    <input type='text' className='form-control' ref='descriptionTextField' value={this.state.description}
                         onChange={this.onChangeDescription.bind(this)} autoFocus/>
                  </div>
                </div>

                <div className="panel panel-default">
                  <div className='panel-heading'>Auction Item</div>
                  <div className='panel-body'>
                    <div className="form-group">
                      <label className="col-sm-2 control-label">Start amount</label>
                      <div className="col-sm-10">
                        <input type='text' className='form-control' ref='startAmountTextField' value={this.state.startAmount}
                             onChange={this.onChangeStartAmount.bind(this)} autoFocus/>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="col-sm-2 control-label">Increment by</label>
                      <div className="col-sm-10">
                        <input type='text' className='form-control' ref='incrementByTextField' value={this.state.incrementBy}
                             onChange={this.onChangeIncrementBy.bind(this)} autoFocus/>
                      </div>
                    </div>
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

export default Vehicle;
