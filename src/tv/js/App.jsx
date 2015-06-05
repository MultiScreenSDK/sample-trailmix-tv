import React from 'react';
import MultiscreenService from './MultiscreenService';
import AudioPlayer from './components/AudioPlayer.jsx';

const COLORS = [
  "#EF6C00",
  "#283593",
  "#689F38",
  "#E91E63",
  "#2196F3",
  "#B71C1C",
  "#10579B",
  "#009688",
  "#673AB7",
  "#607D8B",
  "#880E4F",
  "#3F51B5",
  "#827717",
  "#9C27B0",
  "#4E342E",
  "#E65100",
  "#006064",
  "#1B5E20",
  "#4A148C",
  "#795548"
];

/* TV App */
export default class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      tracks: [],
      play: false,
      time: 0,
      volume: 1.0,
      deviceName: null,
      ssid: null,
    };
    this.channel = null;
    this.clients = 0;
  }

  getCurrentStatus() {
    return this.state.tracks[0]? {
      id: this.state.tracks[0].id,
      state: this.state.play? 'playing' : 'paused',
      time: this.state.time,
      volume: this.state.volume
    } : {};
  }

  getColor() {
    return COLORS[this.clients++ % COLORS.length];
  }

  componentDidMount() {
    console.log('App Mounted');
    new MultiscreenService(this);
  }

  componentDidUpdate(prevProps, prevState) {
    // send trackStart and trackEnd messages
    var currentTrackId = this.state.tracks[0]? this.state.tracks[0].id : null;
    var prevTrackId = prevState.tracks[0]? prevState.tracks[0].id : null;
    if (currentTrackId != prevTrackId) {
      // track changed
      if (prevTrackId) this.channel.publish('trackEnd', prevTrackId, 'broadcast'); // prev track finished
      if (currentTrackId) {
        // new track
        this.channel.publish('trackStart', currentTrackId, 'broadcast');
        if (!prevTrackId) this.setState({play: true}); // first track, start playing
      }
    }
    // trackStatus message
    if (this.channel) this.channel.publish('trackStatus', this.getCurrentStatus(), 'broadcast');
  }

  addTrack(track) {
    console.log('addTrack: ' + track.id);
    this.setState({tracks: this.state.tracks.concat(track)});
  }

  removeTrack(trackId) {
    console.log('removeTrack: ' + trackId);
    // first find the track
    var index = this.state.tracks.findIndex((track) => track.id == trackId);
    if (index == 0) {
      // track is currently playing, just skip to next
      this.fadeToNext();
    } else if (index > 0) {
      // remove the track
      // make a clone of tracks, so that componentDidUpdate has the correct prevState
      var tracks = this.state.tracks.slice();
      tracks.splice(index, 1);
      this.setState({tracks: tracks});
    }
  }

  play() {
    console.log('play');
    this.setState({play: true});
  }

  pause() {
    console.log('pause');
    this.setState({play: false});
  }

  next() {
    console.log('next: ' + this.state.play);
    // make a clone of tracks, so that componentDidUpdate has the correct prevState
    var tracks = this.state.tracks.slice();
    tracks.shift();
    this.setState({tracks: tracks});
  }

  fadeToNext() {
    console.log('fade to next');
    this.refs.audioPlayer.fade(() => this.next());
  }

  volUp() {
    var vol = this.state.volume;
    if (vol <= 0.9) this.setState({volume: vol + 0.1});
  }

  volDown() {
    var vol = this.state.volume;
    if (vol >= 0.1) this.setState({volume: vol - 0.1});
  }

  _onTrackEnded() {
    console.log('** Track Ended **');
    this.next();
  }

  _onTimeUpdate(time) {
    this.setState({time: time});
  }

  render() {
    var track = this.state.tracks[0];
    var nextTrack = this.state.tracks[1];
    var backgroundImage = track? encodeURI(track.albumArt) : 'images/background.jpg';

    return (
      <div id="jukebox-app" style={{'backgroundImage': 'url(' + backgroundImage + ')'}}>
        <IdleScreen track={track} deviceName={this.state.deviceName} ssid={this.state.ssid} />
        <AudioPlayer track={track} play={this.state.play}
          ref="audioPlayer"
          onTrackEnded={this._onTrackEnded.bind(this)}
          onTimeUpdate={this._onTimeUpdate.bind(this)}
          volume={this.state.volume}
          controls={this.props.params} />
        <StatusIcon play={this.state.play} track={track} />
        <CurrentTrackInfo track={track} time={this.state.time} />
        <NextTrackInfo track={nextTrack} />
      </div>
    );
  }
}

/* Simple components */

var IdleScreen = React.createClass({
  render: function() {
    if (this.props.track) return null;
    return (
      <div id="info-screen">
        <div id="tv-info">
          <p>{this.props.deviceName}</p>
          <p>{this.props.ssid? 'On ' + this.props.ssid : ''}</p>
        </div>
        <div id="app-info">
          <img src='images/qr_code.jpg' id="qr-code"/>
          <span><p>Start the Soundscape mobile web app at bit.ly/1PLQ60N.</p><p>Also available for iOS and Android.</p></span>
        </div>
      </div>
    );
  }
});

var StatusIcon = React.createClass({
  render: function() {
    if (!this.props.track) return null;
    var status = this.props.play? 'play' : 'pause';
    return (
      <div id="statusIcon" className={status}>
      </div>
    );
  }
})

var CurrentTrackInfo = React.createClass({
  render: function() {
    if (!this.props.track) return null;
    return (
      <div id="currentTrackInfo">
        <div className="title">{this.props.track.title}</div>
        <div className="artist">{this.props.track.artist}</div>
        <progress max={this.props.track.duration} value={this.props.time}></progress>
      </div>
    );
  }
})

var NextTrackInfo = React.createClass({
  render: function() {
    if (!this.props.track) return null;
    return (
      <div id="nextTrackInfo">
        <p>NEXT SONG</p>
        <div className="title">{this.props.track.title}</div>
        <div className="artist">{this.props.track.artist}</div>
        <img src={encodeURI(this.props.track.albumArt)} style={{display: "none"}} />
      </div>
    );
  }
})
