import React from 'react';
import _ from 'underscore';
import $ from 'jquery';

export default class VideoPlayer extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // set up player callbacks
    var player = React.findDOMNode(this);
    // video ended call back
    player.addEventListener("ended", this.props.onVideoEnded, true);
    // video update, throttle to 1/sec
    player.addEventListener("timeupdate", _.throttle(() => this.props.onTimeUpdate(player.currentTime), 1000), true);
  }

  componentDidUpdate(prevProps, prevState) {
    var player = React.findDOMNode(this);

    // play/stop if the "play" prop changed while fading up/down vol
    if (this.props.play != prevProps.play) {
      this.props.play? player.play() : player.pause();
    }

    // set the vol, if it changed
    if (this.props.volume != prevProps.volume) player.volume = this.props.volume;
  }

  render() {
    var videoFile = this.props.video? encodeURI(this.props.video.file) : '';
    return (
      <video id="player" src={videoFile} autoPlay controls={this.props.controls == 'controls'}></video>
    );
  }
}
