import React from 'react';
import _ from 'underscore';
import $ from 'jquery';

const PAUSE_PLAY_FADE_DURATION = 400;
const NEXT_FADE_DURATION = 1000;

export default class AudioPlayer extends React.Component {
  constructor(props) {
    super(props);
  }

  // fade the vol of the audioplayer before invoking a callback function
  fade(cb) {
    var player = React.findDOMNode(this);
    $(player).animate({volume: 0.0}, NEXT_FADE_DURATION, null, function() {
      cb();
      player.volume = 1.0;
    });
  }

  componentDidMount() {
    // set up player callbacks
    var player = React.findDOMNode(this);
    // track ended call back
    player.addEventListener("ended", this.props.onTrackEnded, true);
    // track update, throttle to 1/sec
    player.addEventListener("timeupdate", _.throttle(() => this.props.onTimeUpdate(player.currentTime), 1000), true);
  }

  componentDidUpdate(prevProps, prevState) {
    var player = React.findDOMNode(this);

    // play/stop if the "play" prop changed while fading up/down vol
    if (this.props.play != prevProps.play) {
      if (this.props.play) {
        player.volume = 0.0;
        player.play();
        $(player).animate({volume: 1.0}, PAUSE_PLAY_FADE_DURATION);
      } else {
        $(player).animate({volume: 0.0}, PAUSE_PLAY_FADE_DURATION, null, () => player.pause());
      }
    }

    // set the vol, if it changed
    if (this.props.volume != prevProps.volume) player.volume = this.props.volume;
  }

  render() {
    var audioFile = this.props.track? encodeURI(this.props.track.file) : '';
    return (
      <audio id="player" src={audioFile} autoPlay controls={this.props.controls == 'controls'}></audio>
    );
  }
}
