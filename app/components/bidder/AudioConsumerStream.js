import React from 'react';
import {Link} from 'react-router';

var socket;

const resetState = {
    totalBytes: 0,
    totalPackets: 0,
    missedPackets: 0,
    lastCounter: null
}

class AudioConsumerStream extends React.Component {

  constructor() {
    super();
    this.state = resetState;
  }

  componentDidMount() {
    socket = io('/audio-stream');

    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    var source;

    socket.on('consumer audio chunk', (data) => {
      var msgCounter = data['counter'];
      var msg = data['chunk'];

      var totalBytes = this.state.totalBytes + msg.byteLength;
      var totalPackets = this.state.totalPackets + 1;
      var missedPackets = this.state.missedPackets;
      var lastCounter = this.state.lastCounter;
      if (!lastCounter) {
        missedPackets = 0;
      } else {
        missedPackets = missedPackets + (msgCounter - lastCounter - 1);
      }
      lastCounter = msgCounter;

      this.setState({
        totalBytes: totalBytes,
        totalPackets: totalPackets,
        missedPackets: missedPackets,
        lastCounter: lastCounter
      });
  		// for a very strange reason the arraybuffer seems to be prefixed with a '4'
  		// (at least when NOT sending a file, but streaming right from a microphone)
  		// thus leading to an odd number of elements and therefore failing to instanciate the Int16Array
  		// var chunk = new Int16Array(msg.slice(1,msg.byteLength));
  		var chunk = new Int16Array(msg);

  		// some logging
  		var s = '';
  		for (var i = 0; i < 80; i++) {
  			s += ' ' + chunk[i];
  		}
  		//console.log('chunk: ' + s);

  		// eventually have some little internal storage to chain multiple chunks together

  		// take the audio chunk and add wave header
  		// write WAV header with brute-force, usage of chunk.length will fail for blocks beyond 64K size
  		// (needs proper conversion to UInt32)
  		var header = new Int16Array([
  			18770, 17990, /* RIFF */
  			chunk.length * 2 + 44 - 8, 0, /* UInt32 file size - 8, pcmdata + 44 - 8 */
  			16727, 17750, /* WAVE */

  			28006, 8308, /* fmt  */
  			16, 0, /* UInt32 chunk size, here always 16 */
  			1, /* PCM format */
  			1, /* channels */
  			44100, 0, /* sample rate (=44100) */
  			22664, 1, /* avg bytes per sec (channels * sample rate = 88200) */
  			2, /* block align */
  			16, /* bits per sample */

  			24932, 24948, /* data */
  			chunk.length * 2, 0 /* chunk size */
  		]);

      var wav = new Int16Array(chunk.length + header.length);
      wav.set(header);
      wav.set(chunk, header.length);

      // some more logging
      var wavBye = new Uint8Array(wav.buffer);
      s = '';
      for (var i = 0; i < wavBye.length; i++) {
      	var h = ("0" + wavBye[i].toString(16)).substr(-2);
      	s += ' ' + h; //wavBye[i].toString(16);
      }
      //console.log('complete' + s);

      // play audio chunk
	    var audioData = wav.buffer; // use msg in case of physical file streaming
	    source = audioCtx.createBufferSource();
	    audioCtx.decodeAudioData(
  			audioData,
  			function(buffer) {
  				source.buffer = buffer;
  				source.connect(audioCtx.destination);
  			},
  			function() { console.log("Error with decoding audio data"); }
  		);
  	  source.start(0);
    });
  }

  componentWillUnmount() {
    socket.removeListener('consumer audio chunk');
  }

  render() {
    return (
        <span>
          (Bytes received: {this.state.totalBytes},
          Packets received: {this.state.totalPackets},
          Missed packets: {this.state.missedPackets},
          Last packet number: {this.state.lastCounter})
        </span>
    );
  }
}

export default AudioConsumerStream;
