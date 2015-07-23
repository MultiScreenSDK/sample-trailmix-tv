# TrailMix

Trailmix is a sample video app for casting videos to Samsung 2015 TVs.
It demonstrates how to cast and control videos from smartphones (Android and iOS)
to Samsung TVs using the Samsung Multiscreen APIs.

The following models are supported: For 2015 TVs
J4500, J5500 and above, (Except for J6200). Models 110S9 are also compatible.

## Links to Code Repos

- [TV App](https://github.com/MultiScreenSDK/trailmix-tv)
- [Android App](https://github.com/MultiScreenSDK/trailmix-android)
- [iOS App](https://github.com/MultiScreenSDK/trailmix-ios-swift)
- [Mobile WebApp](https://github.com/MultiScreenSDK/trailmix-webapp)

## Application Overview

Video files (.mp4) are stored in the cloud. When you launch the mobile app, device discovery reports any compatible TVs. After you connect to the TV, the user can select videos from the cloud library to cast to the TV.

## Communication Protocol (Channel Events)

The communication protocol between the TV host app and the mobile client apps.

####appStateRequest
**client -> host**
Sent to 'host' as a request for the host to send the current application state
```javascript
{
    "event": "appStateRequest",
    "to": "host"
}
```

####play
**client -> host**
Published to TV (host) to play a video. Payload is a video model.
```javascript
{
    "event": "play",
    "data": {
        "id" : "129378641982734", // This id needs be generated and unique per play
        "title": "Mad Max: Fury Road",
        "duration": 144,
        "file": "https://s3.amazonaws.com/dev-multiscreen-video-library/trailers/Mad_Max_Fury_Road_2015_Trailer_F4_5.1-1080p-HDTN.mp4",
    },
    "to": "host"
}
```

You can add a `state` parameter to the video object and set it to the string "paused"
to send a video to the TV, but pause it.
```javascript
{
    "event": "play",
    "data": {
        "id" : "129378641982734", // This id needs be generated and unique per play
        "title": "Mad Max: Fury Road",
        "duration": 144,
        "state": "paused",
        "file": "https://s3.amazonaws.com/dev-multiscreen-video-library/trailers/Mad_Max_Fury_Road_2015_Trailer_F4_5.1-1080p-HDTN.mp4",
    },
    "to": "host"
}
```

You can add a `time` parameter to the video object to start playing at the specified time.
```javascript
{
    "event": "play",
    "data": {
        "id" : "129378641982734", // This id needs be generated and unique per play
        "title": "Mad Max: Fury Road",
        "duration": 144,
        "time": 100,
        "file": "https://s3.amazonaws.com/dev-multiscreen-video-library/trailers/Mad_Max_Fury_Road_2015_Trailer_F4_5.1-1080p-HDTN.mp4",
    },
    "to": "host"
}
```

####stop
**client -> host**
Published to the TV (host) so it will stop playing the video and show the idle screen.
```javascript
{
    "method": "ms.channel.emit",
    "params": {
        "event": "stop",
        "to": "host"
    }
}
```

####pause
**client -> host**
Published to the TV (host) so it will pause playback of the video.
```javascript
{
    "method": "ms.channel.emit",
    "params": {
        "event": "pause",
        "to": "host"
    }
}
```

####resume
**client -> host**
Published to the TV (host) so it will resume playing the video after a pause.
```javascript
{
    "method": "ms.channel.emit",
    "params": {
        "event": "resume",
        "to": "host"
    }
}
```

####seek
**client -> host**
Published to the TV (host) to seek to a specific time in the current video.
```javascript
{
    "method": "ms.channel.emit",
    "params": {
        "event": "seek",
        "data": 100,      // seek to 100 secs
        "to": "host"
    }
}
```

####replay
**client -> host**
Published to the TV (host) to seek to replay the current video from the beginning.
```javascript
{
    "method": "ms.channel.emit",
    "params": {
        "event": "replay",
        "to": "host"
    }
}
```

####appState
**host -> client**
Sent to an individual client as a response to a 'appStateRequest' event. This response includes the id of the video currently playing.

```javascript
{
    "event": "appState",
    "data": {
        currentStatus : {
            id : "129378641982734",
            time : "127",
            state : "playing"
        }
    },
    "to": "<id of client who requested it>"
}
```

####videoStart
**host -> broadcast**
Published to all clients when the host begins playing a video, so they can update the local UI to reflect the currently playing video.
```javascript
{
    "method": "ms.channel.emit",
    "params": {
        "event": "videoStart",
        "data": "129378641982734",
        "to": "broadcast"
    }
}
```

####videoEnd
**host -> broadcast**
Published to all clients when the host finishes playing a video, so they can update the local UI.. and remove the video if desired.
```javascript
{
    "method": "ms.channel.emit",
    "params": {
        "event": "videoEnd",
        "data": "129378641982734",
        "to": "broadcast"
    }
}
```

####videoStatus
**host -> broadcast**
Published to all clients to report any status changes about the video, so they can update the local UI to reflect the change (current playhead time, or play/pause state. Payload is a video status model.
```javascript
{
    "method": "ms.channel.emit",
    "params": {
        "event": "videoStatus",
        "data": {
            id : "129378641982734",
            time : "127",
            state : "playing"
        },
        "to": "broadcast"
    }
}
```
