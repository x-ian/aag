import React from 'react';
import {Link} from 'react-router';
import NotificationAreaMessages from './NotificationAreaMessages';

class NotificationArea extends React.Component {

  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <NotificationAreaMessages messages={this.props.notification ? this.props.notification.messages : ''}/>
        <NotificationAreaMessages type={'error'} messages={this.props.notification ? this.props.notification.errors : ''}/>
      </div>
    );
  }
}

export default NotificationArea;
