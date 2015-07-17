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

    // seek
    if (this.props.seekTime > -1) {
      player.currentTime = this.props.seekTime;
      this.props.resetSeek();
    }

    // play/stop if the "play" prop changed
    if (this.props.play) {
      if (!prevProps.play) player.play();
    } else {
      player.pause();
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
