import React from 'react';
import {Link} from 'react-router';
import AudioConsumerStream from './AudioConsumerStream.js';

const resetState = {
  playAudio: false
}

class AudioConsumer extends React.Component {

  constructor() {
    super();
    this.state = resetState;
  }

  componentDidMount() {
  }

  onClickStart() {
    this.setState({playAudio: true});
  }

  onClickStop() {
    this.setState({playAudio: false});
  }

  render() {
    return (
        <div>
          {
            this.state.playAudio ? (
              <div>
                <button className='btn' onClick={this.onClickStop.bind(this)}>Stop live audio</button>
                <AudioConsumerStream/>
              </div>
            ) : (
              <button className='btn' onClick={this.onClickStart.bind(this)}>Start live audio</button>
            )
          }
        </div>
    );
  }
}

export default AudioConsumer;
