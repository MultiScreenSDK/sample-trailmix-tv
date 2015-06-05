$(function () {

    var socket;

    /*
     UI Elements
     */
    var txtConnectUrl = $("#txtConnectUrl");
    var btnConnect = $("#btnConnect");
    var btnDisconnect = $("#btnDisconnect");
    var selectMethod = $("#selectMethod");
    var btnSend = $("#btnSend");
    var txtSend = $("#txtSend");
    var txtReceive = $("#txtReceive");
    var txtNotification = $("#txtNotification");


    btnConnect.on('click', function () {
        console.debug('btnConnect : click');
        connect();
    });

    btnDisconnect.on('click', function () {
        console.debug('btnDisconnect : click');
        if (socket) {
            socket.close();
        }
    });

    btnSend.on('click', function () {
        console.debug('btnSend : click');
        if (socket) {
            socket.send(txtSend.val());
        }
    });

    selectMethod.on('change', function () {
        console.debug('selectMethod : change');
        var key = $(this).val();
        if (methods[key]) {
            var tplObj = methods[key];
            txtSend.val(JSON.stringify(tplObj, null, 2));
        } else {
            console.warn('no template defined for selected method');
        }

    });

    var connect = function () {
        socket = new WebSocket(txtConnectUrl.val(), ['msf-2', 'msf-3']);
        console.debug('connecting to ' + txtConnectUrl.val());
        socket.addEventListener('open', onSocketOpen);
        socket.addEventListener('message', onSocketMessage);
        socket.addEventListener('close', onSocketClose);
        socket.addEventListener('error', onSocketError);
    };

    var onSocketOpen = function () {
        console.info('websocket connected');
        btnConnect.prop("disabled", true);
        btnSend.prop("disabled", false);
        btnDisconnect.prop("disabled", false);
        $('body').css('background-color', '#C9FF9C');
    };

    var onSocketMessage = function (msg) {
        try {
            msg = JSON.parse(msg.data);
            console.info('websocket message : ', msg);
        } catch (e) {
            console.error('Unable to parse message : ', msg.data);
        }

        if (msg.id) {
            txtReceive.val(JSON.stringify(msg, null, 2));
            txtReceive.addClass('flash');
            txtReceive.one('animationend webkitAnimationEnd', function () {
                $(this).removeClass('flash');
            });
        } else {
            txtNotification.val(JSON.stringify(msg, null, 2));
            txtNotification.addClass('flash');
            txtNotification.one('animationend webkitAnimationEnd', function () {
                $(this).removeClass('flash');
            });
        }

    };

    var onSocketClose = function () {
        console.warn('websocket disconnected');
        btnConnect.prop("disabled", false);
        btnDisconnect.prop("disabled", true);
        btnSend.prop("disabled", true);
        socket = null;
        $('body').css('background-color', '#E5E5E5');
    };

    var onSocketError = function (evt) {
        console.error('websocket error : ', evt);
    };

    var initUI = function () {
        txtConnectUrl.val('ws://127.0.0.1:8001/api/v2/channels/com.samsung.soundscape');
        btnDisconnect.prop("disabled", true);
        btnSend.prop("disabled", true);
        for (var key in methods) {
            if (methods.hasOwnProperty(key)) {
                var option = $('<option />')
                    .attr('value', key)
                    .text(key)
                    .appendTo(selectMethod);
            }
        }
        selectMethod.change();

        connect();
    };


    var methods = {

        "addTrack (My Delirium) ": {
            "method": "ms.channel.emit",
            "params": {
                "event": "addTrack",
                "data": {
                    "id" : "129378641982734",
                    "artist": "Ladyhawke",
                    "album": "Ladyhawke",
                    "title": "My Delirium",
                    "duration": 256,
                    "file": "http://s3-us-west-1.amazonaws.com/dev-multiscreen-music-library/songs/Ladyhawke - Ladyhawke - My Delirium.mp3",
                    "albumArt": "http://s3-us-west-1.amazonaws.com/dev-multiscreen-music-library/artwork/Ladyhawke-Ladyhawke.jpg",
                    "albumArtThumbnail": "http://s3-us-west-1.amazonaws.com/dev-multiscreen-music-library/artwork/Ladyhawke-Ladyhawke-thumbnail.jpg",
                    "color": "#01579b"
                },
                "to": "broadcast"
            }
        },

        "addTrack (Mos Def)": {
            "method": "ms.channel.emit",
            "params": {
                "event": "addTrack",
                "data": {
                    "id" : "129378456342734",
                    "artist": "DJ Honda feat Mos Def",
                    "album": "Travellin Man",
                    "title": "Travellin Man",
                    "duration": 317,
                    "file": "http://s3-us-west-1.amazonaws.com/dev-multiscreen-music-library/songs/DJ Honda feat Mos Def - Travellin Man - Travellin Man.mp3",
                    "albumArt": "http://s3-us-west-1.amazonaws.com/dev-multiscreen-music-library/artwork/DJ Honda feat Mos Def-Travellin Man.jpg",
                    "albumArtThumbnail": "http://s3-us-west-1.amazonaws.com/dev-multiscreen-music-library/artwork/DJ Honda feat Mos Def-Travellin Man-thumbnail.jpg",
                    "color": "#673ab7"
                },
                "to": "broadcast"
            }
        },

        "removeTrack (Mos Def)": {
            "method": "ms.channel.emit",
            "params": {
                "event": "removeTrack",
                "data": "129378456342734",
                "to": "broadcast"
            }
        },

        "play": {
            "method": "ms.channel.emit",
            "params": {
                "event": "play",
                "to": "broadcast"
            }
        },

        "pause": {
            "method": "ms.channel.emit",
            "params": {
                "event": "pause",
                "to": "broadcast"
            }
        },

        "next": {
            "method": "ms.channel.emit",
            "params": {
                "event": "next",
                "to": "broadcast"
            }
        },

        "trackStart": {
            "method": "ms.channel.emit",
            "params": {
                "event": "trackStart",
                "data": "129378641982734",
                "to": "broadcast"
            }
        },

        "trackEnd": {
            "method": "ms.channel.emit",
            "params": {
                "event": "trackEnd",
                "data": "129378641982734",
                "to": "broadcast"
            }
        },

        "trackStatus": {
            "method": "ms.channel.emit",
            "params": {
                "event": "trackStatus",
                "data": {
                    id : "129378641982734",
                    time : "127",
                    state : "playing"
                },
                "to": "broadcast"
            }
        },

        "appStateRequest": {
            "method": "ms.channel.emit",
            "params": {
                "event": "appStateRequest",
                "to": "host"
            }
        },


        "appState": {
            "method": "ms.channel.emit",
            "params": {
                "event": "appState",
                "data": {
                    currentStatus : {
                        id : "129378641982734",
                        time : "127",
                        state : "playing"
                    },
                    playlist : [
                        {
                            "id" : "129378641982734",
                            "artist": "Ladyhawke",
                            "album": "Ladyhawke",
                            "title": "My Delirium",
                            "duration": 256,
                            "file": "http://s3-us-west-1.amazonaws.com/dev-multiscreen-music-library/songs/Ladyhawke - Ladyhawke - My Delirium.mp3",
                            "albumArt": "http://s3-us-west-1.amazonaws.com/dev-multiscreen-music-library/artwork/Ladyhawke-Ladyhawke.jpg",
                            "albumArtThumbnail": "http://s3-us-west-1.amazonaws.com/dev-multiscreen-music-library/artwork/Ladyhawke-Ladyhawke-thumbnail.jpg",
                            "color": "#01579b"
                        },
                        {
                            "id" : "12937fgfds2734",
                            "artist": "City and Colour",
                            "album": "Alternative Times, Volume 97",
                            "title": "Sleeping Sickness",
                            "duration": 248,
                            "file": "http://s3-us-west-1.amazonaws.com/dev-multiscreen-music-library/songs/City and Colour - Alternative Times, Volume 97 - Sleeping Sickness.mp3",
                            "albumArt": "http://s3-us-west-1.amazonaws.com/dev-multiscreen-music-library/artwork/City and Colour-Alternative Times, Volume 97.jpg",
                            "albumArtThumbnail": "http://s3-us-west-1.amazonaws.com/dev-multiscreen-music-library/artwork/City and Colour-Alternative Times, Volume 97-thumbnail.jpg",
                            "color": "#e65100"
                        },
                        {
                            "id" : "1293453245982734",
                            "artist": "k.flay",
                            "album": "Eyes Shut",
                            "title": "Sunburn",
                            "duration": 237,
                            "file": "http://s3-us-west-1.amazonaws.com/dev-multiscreen-music-library/songs/k.flay - Eyes Shut - Sunburn.mp3",
                            "albumArt": "http://s3-us-west-1.amazonaws.com/dev-multiscreen-music-library/artwork/k.flay-Eyes Shut.jpg",
                            "albumArtThumbnail": "http://s3-us-west-1.amazonaws.com/dev-multiscreen-music-library/artwork/k.flay-Eyes Shut-thumbnail.jpg",
                            "color": "#e65100"
                        }
                    ]
                },
                "to": "broadcast"
            }
        }

    };

    initUI();


});