import React from 'react';
import {Link} from 'react-router';
import InputFormRow from '../common/InputFormRow.js';
import SelectInput from '../common/SelectInput.js';

const resetState = {
  email: '',
  name: '',
  passwordCleartext: '',
  passwordCleartextRepeat: '',
  passwordsMatch: false
}

class Register extends React.Component {

  constructor() {
    super();
    this.state = resetState;
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  onChangeName(e) { this.setState({name: e.target.value}) }
  onChangeEmail(e) { this.setState({email: e.target.value}) }
  onChangePasswordCleartext(e) {
    this.setState({passwordCleartext: e.target.value});
    this.setState({passwordsMatch: (e.target.value === this.state.passwordCleartextRepeat)});
  }
  onChangePasswordCleartextRepeat(e) {
    this.setState({passwordCleartextRepeat: e.target.value});
    this.setState({passwordsMatch: (this.state.passwordCleartext === e.target.value)});
  }

  onClickCancel(event) {
    event.preventDefault();
    console.log(this.state);
  }


  signup(name, email, passwordCleartext) {
    $.ajax({
      url: '/api/users',
      type: 'POST',
      dataType: 'json',
      data: {
        name: name,
        passwordCleartext: passwordCleartext,
        email: email
      }
    }).done((data) => {
      this.setState(resetState);
      setTimeout(function(){
        this.props.history.pushState(null, '/');
      }.bind(this), 1000);
    }).fail((jqXhr) => {
      console.log('ERROR: ' + jqXhr);
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.signup(this.state.name, this.state.email, this.state.passwordCleartext);
  }

  render() {
    return (
      <div className='container'>
        <div className='panel panel-default'>
          <div className='panel-heading'>Register new account</div>
          <div className='panel-body'>
            <form onSubmit={this.handleSubmit.bind(this)} className='form-horizontal'>
              <InputFormRow
                label='Name'
                type='text'
                value={this.state.name}
                onChange={this.onChangeName.bind(this)}/>
              <InputFormRow
                label='Email'
                type='text'
                value={this.state.email}
                onChange={this.onChangeEmail.bind(this)}/>
              <InputFormRow
                label='Password'
                type='password'
                value={this.state.passwordCleartext}
                onChange={this.onChangePasswordCleartext.bind(this)}/>
              <InputFormRow
                label='Repeat password'
                type='password'
                value={this.state.passwordCleartextRepeat}
                onChange={this.onChangePasswordCleartextRepeat.bind(this)}/>

              <div className="form-group">
                 <div className="col-sm-offset-2 col-sm-10">
                 {(this.state.name && this.state.email && this.state.passwordsMatch) ? <button type='submit' className='btn btn-primary'>Register</button> : '' }
                    <button className='btn btn-secondary' onClick={this.onClickCancel.bind(this)}>Cancel</button>
                  </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;
