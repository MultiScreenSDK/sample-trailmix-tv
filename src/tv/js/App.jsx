import React from 'react';
import MultiscreenService from './MultiscreenService';
import VideoPlayer from './components/VideoPlayer.jsx';

/* TV App */
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      video: null,
      play: true,
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
      state: this.state.play? 'playing' : 'paused',
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
    if (currentVideoId != prevVideoId) {
      // video changed
      if (prevVideoId) this.channel.publish('videoEnd', prevVideoId, 'broadcast'); // prev video finished
      if (currentVideoId) this.channel.publish('videoStart', currentVideoId, 'broadcast'); // new video started
    }
    // videoStatus message
    if (this.channel) this.channel.publish('videoStatus', this.getCurrentStatus(), 'broadcast');
  }

  play(video) {
    console.log('play: ' + video.id);
    this.setState({video: video, play: true});
  }

  stop() {
    console.log('stop');
    this.setState({video: null});
  }

  pause() {
    console.log('pause');
    this.setState({play: false});
  }

  resume() {
    console.log('play');
    this.setState({play: true});
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
    this.setState({video: null});
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
            <IdleScreen app={this} />
          </div>
        );

    return (
      <div id="trailmix-app">
        <VideoPlayer
          ref="audioPlayer"
          video={video}
          play={this.state.play}
          seekTime={this.state.seekTime}
          volume={this.state.volume}
          onVideoEnded={this._onVideoEnded.bind(this)}
          onTimeUpdate={this._onTimeUpdate.bind(this)}
          resetSeek={this._resetSeek.bind(this)}
          controls={this.props.params} />
        <StatusIcon play={this.state.play} />
        <VideoInfo video={video} play={this.state.play} />
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
          <p>{this.props.app.deviceName}</p>
          <p>{this.props.app.ssid? 'On ' + this.props.app.ssid : ''}</p>
        </div>
        <div id="app-info">
          <img src='images/qr_code.jpg' id="qr-code"/>
          <span><p>Start the TrailerMix mobile web app at bit.ly/xyz.</p><p>Also available for iOS and Android.</p></span>
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
