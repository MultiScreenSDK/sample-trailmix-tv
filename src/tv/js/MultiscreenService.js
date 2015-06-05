export default class MultiscreenService {

  constructor(app) {
    // Get a reference to the local "service"
    window.msf.local(function(err, service) {
      if (err) return console.error('msf.local error: ' + err);

      app.setState({deviceName: service.name, ssid: service.device.ssid});

      // Create a reference to a communication "channel"
      var channel = service.channel('com.samsung.soundscape');

      // Connect to the channel
      channel.connect(function(err) {
        if (err) return console.error(err);
        console.log('You are connected!');
        app.channel = channel;
      });

      channel.on('assignColorRequest', function(data, client) {
        var color = app.getColor();
        console.log('assignColor: ' + client.id + ' => ' + color);
        channel.publish('assignColor', color, client.id);
      });

      channel.on('appStateRequest', function(data, client) {
        console.log(client.id + '=> appStateRequest');
        channel.publish('appState', {
          currentStatus: app.getCurrentStatus(),
          playlist: app.state.tracks
        }, client.id);
      });

      channel.on('addTrack', function(data, client) {
        console.log(client.id + '=> addTrack: ' + JSON.stringify(data));
        app.addTrack(data);
      });

      channel.on('removeTrack', function(data, client) {
        console.log(client.id + '=> removeTrack: ' + JSON.stringify(data));
        app.removeTrack(data);
      });

      channel.on('play', function(data, client) {
        console.log(client.id + '=> play');
        app.play();
      });

      channel.on('pause', function(data, client) {
        console.log(client.id + '=> pause');
        app.pause();
      });

      channel.on('next', function(data, client) {
        console.log(client.id + '=> next');
        app.fadeToNext();
      });

      channel.on('replay', function(data, client) {
        console.log(client.id + '=> replay');
        app.replay();
      });

      channel.on('volUp', function(data, client) {
        console.log(client.id + '=> volUp');
        app.volUp();
      });

      channel.on('volDown', function(data, client) {
        console.log(client.id + '=> volDown');
        app.volDown();
      });
    });
  }
}
