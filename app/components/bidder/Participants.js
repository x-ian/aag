import React from 'react';
import {Link} from 'react-router';

class Participants extends React.Component {

  constructor() {
    super();
  }

  render() {
    let participants = this.props.participants.map((participant, index) => {
      return (
        <div key={participant.id} className='list-group-item animated fadeIn'>
          <div className='media'>
            {participant.name} ({participant.userAgent} {participant.location} {participant.ip})
          </div>
        </div>
      );
    });

    return (
        <div className='list-group'>
          <div className='panel-heading'>Participants</div>
          {participants}
        </div>
    );
  }
}

export default Participants;
