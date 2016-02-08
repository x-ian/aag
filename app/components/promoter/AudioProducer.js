import React from 'react';
import {Link} from 'react-router';

class AudioProducer extends React.Component {

  constructor() {
    super();
  }

  componentDidMount() {
  }

  render() {
    return (
        <div>Stream audio: <a target="_blank" href="/audioproducer.html">Open in new window (only Firefox)</a></div>
    );
  }
}

export default AudioProducer;
