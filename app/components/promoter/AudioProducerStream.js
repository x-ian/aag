import React from 'react';
import {Link} from 'react-router';
import {isEqual} from 'underscore';

var socket;

const resetState = {
  recording: false,
  socket: null,
}

class AudioProducer extends React.Component {

  constructor() {
    super();
    this.state = resetState;
  }

  componentDidMount() {
    socket = io('/audio-stream');
    // this.state.socket = socket;

    if (!navigator.getUserMedia)
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia || navigator.msGetUserMedia;

    if (navigator.getUserMedia) {
      navigator.getUserMedia({audio:true}, this.success.bind(this), function(e) {
        console.log('Error capturing audio.');
      });
    } else console.log('getUserMedia not supported in this browser.');
  }

  startAudio() {
    this.setState({recording: true});
  }

  stopAudio() {
    this.setState({recording: false});
    // socket.end();
  }

 success(e) {
   console.log("1 " + this.state);
    var audioContext = window.AudioContext || window.webkitAudioContext;
    var context = new audioContext();

    // the sample rate is in context.sampleRate
    var audioInput = context.createMediaStreamSource(e);

    var bufferSize = 16384; //2048;
    var recorder = context.createScriptProcessor(bufferSize, 1, 1);


    var counter = 0;

    var outerThis = this;

    recorder.onaudioprocess =  (e) => {
      console.log ('recording');
         if(!this.state.recording) return;
      var left = e.inputBuffer.getChannelData(0);
      var ab1 = this.convertFloat32ToInt16(left);

      console.log('emit bytes: ' + ab1.byteLength);
      var msg = {
        counter: (counter++),
        chunk: ab1
      }
      // this.socket.emit('producer audio chunk', msg);

      // some logging
      var ab = new Int16Array(ab1);
      var s = '';
      for (var i = 0; i < 1024; i++) {
        s += ' ' + ab[i];
      }
      //console.log(s);

  }

    audioInput.connect(recorder);
    recorder.connect(context.destination);
  }


  captureAudio(e) {
    console.log('1');
    console.log(this.state.recording);
    var audioContext = window.AudioContext || window.webkitAudioContext;
    var context = new audioContext();

    // the sample rate is in context.sampleRate
    var audioInput = context.createMediaStreamSource(e);

    var bufferSize = 16384; //2048;
    var recorder = context.createScriptProcessor(bufferSize, 1, 1);

    recorder.onaudioprocess =  (e) => {
        console.log(this.state);
        console.log(e);
        console.log(e.inputBuffer);
        if(!this.state.recording) return;
        console.log ('recording');
        var left = e.inputBuffer.getChannelData(0);
        var ab1 = this.convertFloat32ToInt16(left);

        console.log('emit bytes: ' + ab1.byteLength);
        // this.props.broadcastPromoterAudioChunk(ab1);

        // some logging
        var ab = new Int16Array(ab1);
        var s = '';
        for (var i = 0; i < 1024; i++) {
          s += ' ' + ab[i];
        }
        //console.log(s);
      }
      ;

    audioInput.connect.bind(this ,recorder);
    recorder.connect(context.destination);
  }


  convertFloat32ToInt16(buffer) {
    var l = buffer.length;
    var buf = new Int16Array(l)

    while (l--) {
      buf[l] = buffer[l]*0xFFFF;    //convert to 16 bit
    }
//	  console.log(buf)
    return buf.buffer
  }

  render() {
    return (
        <div>
          <button className='btn' onClick={this.startAudio.bind(this)}>Start audio</button>
          <button className='btn' onClick={this.stopAudio.bind(this)}>Stop audio</button>
        </div>
    );
  }

};

export default AudioProducer;
