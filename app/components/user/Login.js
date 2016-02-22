import React from 'react';
import {Link} from 'react-router';
import InputFormRow from '../common/InputFormRow.js';
import NotificationArea from '../common/NotificationArea.js';

const resetState = {
  email: '',
  password: '',
  notification: null
}

class Login extends React.Component {

  constructor() {
    super();
    this.state = resetState;
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  onChangeEmail(e) { this.setState({email: e.target.value}) }
  onChangePassword(e) { this.setState({password: e.target.value}); }

  onClickCancel(event) {
    event.preventDefault();
    console.log(this.state);
  }

  login(email, password) {
    $.ajax({
      url: '/api/login',
      type: 'POST',
      // dataType: 'json',
      data: {
        password: password,
        email: email
      }
    }).done((data) => {
      this.props.history.pushState(null, '/');
    }).fail((jqXhr) => {
      console.log('Error: ' + jqXhr);
      var n = {errors: [jqXhr.responseJSON.message + ' (' + jqXhr.statusText + ')']};
      this.setState({notification: n})
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.login(this.state.email, this.state.password);
  }

  render() {
    return (
      <div className='container'>
        <NotificationArea notification={this.state.notification}/>
        <div className='panel panel-default'>
          <div className='panel-heading'>Login</div>
          <div className='panel-body'>
            <form onSubmit={this.handleSubmit.bind(this)} className='form-horizontal'>
              <InputFormRow
                label='Email'
                type='text'
                value={this.state.email}
                onChange={this.onChangeEmail.bind(this)}/>
              <InputFormRow
                label='Password'
                type='password'
                value={this.state.password}
                onChange={this.onChangePassword.bind(this)}/>
              <div className="form-group">
                 <div className="col-sm-offset-2 col-sm-10">
                   <button type='submit' className='btn btn-primary'>Login</button>
                   &nbsp;No account? <Link to='/register'>Register one</Link>.
                 </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
