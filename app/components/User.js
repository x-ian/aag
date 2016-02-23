import React from 'react';
import {Link} from 'react-router';

import DateTimeSelect from './common/DateTimeSelect.js'

const resetState = {
  _id: "",
  name: "",
  email: "",
  deactivated: false,
  isSeller: false,
  isBuyer: false,
  isPromoter: false
}

class User extends React.Component {

  constructor() {
    super();
    this.state = resetState;
  }

  componentDidMount() {
    if (this.props.params.id) {
      this.setUser(this.props.params.id);
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.params.id && prevProps.params.id !== this.props.params.id) {
      this.setUser(this.props.params.id)
    }
  }

  onChangeName(e) { this.setState({name: e.target.value}) }
  onChangeEmail(e) { this.setState({email: e.target.value}) }
  onChangeDeactivated(e) { this.setState({deactivated: e.target.checked}) }
  onChangeIsSeller(e) { this.setState({isSeller: e.target.checked}) }
  onChangeIsBuyer(e) { this.setState({isBuyer: e.target.checked}) }
  onChangeIsPromoter(e) { this.setState({isPromoter: e.target.checked}) }

  onClickDelete(event) {
    event.preventDefault();

    $.ajax({
      url: '/api/users/' + this.state._id,
      dataType: 'json',
      type: 'DELETE'})
      .done((data) => {
         // doesnt seem right, but dont know how else to get back to the list after successful add
           setTimeout(function(){
             this.props.history.pushState(null, '/users');
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
    this.props.history.pushState(null, '/users');
  }

  setUser(id) {
    $.ajax({
      url: '/api/users/' + id,
      dataType: 'json' })
      .done((data) => {
        this.setState(data);
      })
      .fail((jqXhr) => {
        console.log('ERROR: ' + jqXhr);
      });
  }

  addUser(email, name, isBuyer, isSeller, isPromoter, deactivated) {
    $.ajax({
      url: '/api/users',
      dataType: 'json',
      type: 'POST',
      data: {
          email: email,
          name: name,
          deactivated: deactivated,
          isBuyer: isBuyer,
          isSeller: isSeller,
          isPromoter: isPromoter
        }
       })
       .done((data) => {
        //  this.actions.addVehicleSuccess(data.message);
         // doesnt seem right, but dont know how else to get back to the list after successful add
           setTimeout(function(){
             this.props.history.pushState(null, '/users');
           }.bind(this), 1000);
           this.setState(resetState);
       })
       .fail((jqXhr) => {
         console.log('ERROR: ' + jqXhr);
       });
  }

  updateUser(id, email, name, isBuyer, isSeller, isPromoter, deactivated) {
    $.ajax({id,
      url: '/api/users/' + id,
      dataType: 'json',
      type: 'PUT',
      data: {
          id: id,
          email: email,
          name: name,
          deactivated: deactivated,
          isBuyer: isBuyer,
          isSeller: isSeller,
          isPromoter: isPromoter
        }
       })
       .done((data) => {
        //  this.actions.addVehicleSuccess(data.message);
         // doesnt seem right, but dont know how else to get back to the list after successful add
           setTimeout(function(){
             this.props.history.pushState(null, '/users');
           }.bind(this), 1000);
           this.setState(resetState);
       })
       .fail((jqXhr) => {
         console.log('ERROR: ' + jqXhr);
       });
  }

  handleSubmit(event) {
    event.preventDefault();

    var name = this.state.name;
    var email = this.state.email;
    var deactivated = this.state.deactivated;
    var isPromoter = this.state.isPromoter;
    var isSeller = this.state.isSeller;
    var isBuyer = this.state.isBuyer;

      if (this.state._id) {
        this.updateUser(this.state._id, email, name, isBuyer, isSeller, isPromoter, deactivated);
      } else {
        this.addUser(email, name, isBuyer, isSeller, isPromoter, deactivated);
      }
  }

  render() {
    return (
      <div className="container">
        <div className='panel panel-default'>
          <div className='panel-heading'>View/edit/add User</div>
          <div className='panel-body'>
            <form onSubmit={this.handleSubmit.bind(this)} className='form-horizontal'>
              <div className="form-group">
                <label className="col-sm-2 control-label">ID</label>
                <div className="col-sm-10">
                  <p className="form-control-static">{this.state._id}</p>
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-2 control-label">Name</label>
                <div className="col-sm-10">
                  <input type='text' className='form-control' ref='nameTextField' value={this.state.name}
                    onChange={this.onChangeName.bind(this)} autoFocus/>
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-2 control-label">Email</label>
                <div className="col-sm-10">
                  <input type='text' className='form-control' ref='emailTextField' value={this.state.email}
                    onChange={this.onChangeEmail.bind(this)} autoFocus/>
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-2 control-label">Deactivated</label>
                <div className="col-sm-10">
                  <div className="checkbox">
                    <label>
                      <input type="checkbox" onChange={this.onChangeDeactivated.bind(this)} checked={this.state.deactivated}/>
                    </label>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-2 control-label">Is Buyer</label>
                <div className="col-sm-10">
                  <div className="checkbox">
                    <label>
                      <input type="checkbox" onChange={this.onChangeIsBuyer.bind(this)} checked={this.state.isBuyer}/>
                    </label>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-2 control-label">Is Seller</label>
                <div className="col-sm-10">
                  <div className="checkbox">
                    <label>
                      <input type="checkbox" onChange={this.onChangeIsSeller.bind(this)} checked={this.state.isSeller}/>
                    </label>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-2 control-label">Is Promoter</label>
                <div className="col-sm-10">
                  <div className="checkbox">
                    <label>
                      <input type="checkbox" onChange={this.onChangeIsPromoter.bind(this)} checked={this.state.isPromoter}/>
                    </label>
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

export default User;
