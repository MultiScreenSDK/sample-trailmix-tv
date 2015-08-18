import React from 'react';
import MultiscreenService from './MultiscreenService';
import VideoPlayer from './components/VideoPlayer.jsx';

/* TV App */
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      video: null,
      playerState: null,
      currentTime: 0,
      seekTime: -1,
      volume: 1.0,
      deviceName: null,
      ssid: null
    };

    this.channel = null;
    this.clients = 0;
  }

  getCurrentStatus() {
    return this.state.video? {
      title: this.state.video.title,
      duration: this.state.video.duration,
      id: this.state.video.id,
      state: this.state.playerState,
      time: this.state.currentTime,
      volume: this.state.volume
    } : {};
  }

  componentDidMount() {
    console.log('App Mounted');
    new MultiscreenService(this);
  }

  componentDidUpdate(prevProps, prevState) {
    // send videoStart and videoEnd messages
    var currentVideoId = this.state.video? this.state.video.id : null;
    var prevVideoId = prevState.video? prevState.video.id : null;
    if (this.channel) {
      // channel notifications
      if (currentVideoId != prevVideoId) {
        // videoEnd and start
        if (prevVideoId) this.channel.publish('videoEnd', prevVideoId, 'broadcast'); // prev video finished
        if (currentVideoId) this.channel.publish('videoStart', currentVideoId, 'broadcast'); // new video started
      }
      // videoStatus message
      if (this.state.currentTime != prevState.currentTime) this.channel.publish('videoStatus', this.getCurrentStatus(), 'broadcast');
    }
  }

  play(video) {
    console.log('play: ' + video.id);
    this.setState({video: video, playerState: video.state || 'playing', seekTime: video.time});
  }

  stop() {
    console.log('stop');
    this.setState({video: null});
  }

  pause() {
    console.log('pause');
    this.setState({playerState: 'paused'});
  }

  resume() {
    console.log('play');
    this.setState({playerState: 'playing'});
  }

  seek(seekTime) {
    console.log('seek');
    this.setState({seekTime: seekTime});
  }

  replay() {
    console.log('seek');
    this.setState({seekTime: 0});
  }

  volUp() {
    var vol = this.state.volume;
    if (vol <= 0.9) this.setState({volume: vol + 0.1});
  }

  volDown() {
    var vol = this.state.volume;
    if (vol >= 0.1) this.setState({volume: vol - 0.1});
  }

  _onVideoEnded() {
    console.log('** Video Ended **');
    this.setState({playerState: 'ended'});
    this.channel.publish('videoEnd', this.state.video.id, 'broadcast');
  }

  _onTimeUpdate(currentTime) {
    this.setState({currentTime: currentTime});
  }

  _resetSeek() {
    this.setState({seekTime: -1});
  }

  render() {
    var video = this.state.video;

    if (!video) return (
          <div id="trailmix-app">
            <IdleScreen deviceName={this.state.deviceName} />
          </div>
        );

    return (
      <div id="trailmix-app">
        <VideoPlayer
          ref="audioPlayer"
          video={video}
          play={this.state.playerState === 'playing'}
          seekTime={this.state.seekTime}
          volume={this.state.volume}
          onVideoEnded={this._onVideoEnded.bind(this)}
          onTimeUpdate={this._onTimeUpdate.bind(this)}
          resetSeek={this._resetSeek.bind(this)}
          controls={this.props.params} />
        <StatusIcon play={this.state.playerState === 'playing'} />
        <VideoInfo video={video} play={this.state.playerState === 'playing'} />
        <progress max={video.duration} value={this.state.currentTime}></progress>
      </div>
    );
  }
}

/* Simple components */

var IdleScreen = React.createClass({
  render: function() {
    return (
      <div id="idle-screen">
        <div id="tv-info">
          {this.props.deviceName}
        </div>
        <div id="app-info">
          Mobile App is available on iOS and Android
        </div>
      </div>
    );
  }
});

var StatusIcon = React.createClass({
  render: function() {
    var status = this.props.play? 'play' : 'pause';
    return (
      <div id="status-icon" className={status}>
      </div>
    );
  }
})

var VideoInfo = React.createClass({
  render: function() {
    if (!this.props.video) return null;
    return (
      <div id="video-info" className="fade-in-out">
        <div className="title">{this.props.video.title}</div>
      </div>
    );
  }
})
