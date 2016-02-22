import React from 'react';
import {Link} from 'react-router';

class NotificationAreaMessages extends React.Component {

  constructor() {
    super();
  }

  render() {
    let messagesList = '';
    if (this.props.messages) {
      messagesList = this.props.messages.map((msg, index) => {
        return (
          <p key={index} className={this.props.type === 'error' ? "bg-danger" : "bg-info"}>{msg}</p>
        );
      });
    }

    return (
      <div>
        {messagesList}
      </div>
    );
  }
}

export default NotificationAreaMessages;
