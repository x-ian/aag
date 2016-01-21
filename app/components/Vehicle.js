import React from 'react';
import {Link} from 'react-router';

const resetState = {
  id: "",
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

  onChangeTitle(e) { this.setState({title: e.target.value}) }

  onChangeDescription(e) { this.setState({description: e.target.value}) }

  onClickDelete(event) {
    event.preventDefault();

    $.ajax({
      url: '/api/vehicles/' + this.state.id,
      dataType: 'json',
      type: 'DELETE'})
      .done((data) => {
         console.log('ok');
        //  this.actions.addVehicleSuccess(data.message);
         // doesnt seem right, but dont know how else to get back to the list after successful add
           setTimeout(function(){
             this.props.history.pushState(null, '/vehicles');
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
    this.props.history.pushState(null, '/vehicles');
  }

  setVehicle(id) {
    $.ajax({
      url: '/api/vehicles/' + id,
      dataType: 'json' })
      .done((data) => {
        this.setState({
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

  addVehicle(title, description) {
    $.ajax({
      url: '/api/vehicles',
      dataType: 'json',
      type: 'POST',
      data: {
          title: title,
          description: description
        }
       })
       .done((data) => {
        //  this.actions.addVehicleSuccess(data.message);
         // doesnt seem right, but dont know how else to get back to the list after successful add
           setTimeout(function(){
             this.props.history.pushState(null, '/vehicles');
           }.bind(this), 1000);
           this.setState(resetState);
       })
       .fail((jqXhr) => {
        //  this.actions.addVehicleFail(jqXhr.responseJSON.message);
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
          description: description
        }
       })
       .done((data) => {
        //  this.actions.addVehicleSuccess(data.message);
         // doesnt seem right, but dont know how else to get back to the list after successful add
           setTimeout(function(){
             this.props.history.pushState(null, '/vehicles');
           }.bind(this), 1000);
           this.setState(resetState);
       })
       .fail((jqXhr) => {
        //  this.actions.addVehicleFail(jqXhr.responseJSON.message);
       });
  }

  handleSubmit(event) {
    event.preventDefault();

    var title = this.state.title.trim();
    var description = this.state.description.trim();

    if (!title) {
      this.titleValidationState = 'has-error';
      this.helpBlock = 'Please enter a title.';
      this.refs.titleTextField.focus();
    }

    if (title) {
      if (this.state.id) {
        this.updateVehicle(this.state.id, title, description)
      } else {
        this.addVehicle(title, description);
      }
    }
  }

  render() {
    return (
      <div className="vehicleBox">
        <div className='container'>
          <div className='row flipInX animated'>
            <div className='col-sm-8'>
              <div className='panel panel-default'>
                <div className='panel-heading'>View/edit/add Vehicle</div>
                <div className='panel-body'>
                <form onSubmit={this.handleSubmit.bind(this)}>
                  <table><tbody>
                <tr>
                    <td>
                      <label className='control-label'>ID</label>
                    </td><td>
                      ID: {this.state.id}
                    </td>
                  </tr><tr>
                    <td>
                      <label className='control-label'>Title</label>
                    </td><td>
                      <input type='text' className='form-control' ref='titleTextField' value={this.state.title}
                          onChange={this.onChangeTitle.bind(this)} autoFocus/>
                      <span className='help-block'>{this.state.helpBlock}</span>
                    </td>
                  </tr><tr>
                    <td>
                      <label className='control-label'>Description</label>
                    </td><td>
                      <input type='text' className='form-control' ref='descriptionTextField' value={this.state.description}
                           onChange={this.onChangeDescription.bind(this)} autoFocus/>
                   </td>
                  </tr>
                  </tbody></table>

                  {this.state.id ?
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

export default Vehicle;
