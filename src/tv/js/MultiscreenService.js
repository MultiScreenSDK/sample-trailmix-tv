export default class MultiscreenService {

  constructor(app) {
    // Get a reference to the local "service"
    window.msf.local(function(err, service) {
      if (err) return console.error('msf.local error: ' + err);

      app.setState({deviceName: service.name, ssid: service.device.ssid});

      // Create a reference to a communication "channel"
      var channel = service.channel('com.samsung.trailmix');

      // Connect to the channel
      channel.connect(function(err) {
        if (err) return console.error(err);
        console.log('You are connected!');
        app.channel = channel;
      });

      channel.on('appStateRequest', function(data, client) {
        console.log(client.id + '=> appStateRequest');
        channel.publish('appState', {
          currentStatus: app.getCurrentStatus(),
          playlist: app.state.tracks
        }, client.id);
      });

      channel.on('play', function(data, client) {
        console.log(client.id + '=> play: ' + JSON.stringify(data));
        app.play(data);
      });

      channel.on('stop', function(data, client) {
        console.log(client.id + '=> stop');
        app.stop();
      });

      channel.on('pause', function(data, client) {
        console.log(client.id + '=> pause');
        app.pause();
      });

      channel.on('resume', function(data, client) {
        console.log(client.id + '=> resume');
        app.resume();
      });

      channel.on('seek', function(data, client) {
        console.log(client.id + '=> seek: ' + JSON.stringify(data));
        app.seek(data);
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
