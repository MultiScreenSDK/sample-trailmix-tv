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
        txtConnectUrl.val('ws://127.0.0.1:8001/api/v2/channels/com.samsung.trailmix');
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
        "play (Mad Max: Fury Road) ": {
            "method": "ms.channel.emit",
            "params": {
                "event": "play",
                "data": {
                    "id" : "129378641982734",
                    "title": "Mad Max: Fury Road",
                    "duration": 144,
                    "file": "https://s3.amazonaws.com/dev-multiscreen-video-library/trailers/Mad_Max_Fury_Road_2015_Trailer_F4_5.1-1080p-HDTN.mp4",
                },
                "to": "broadcast"
            }
        },

        "play (Mission: Impossible - Rogue Nation) ": {
            "method": "ms.channel.emit",
            "params": {
                "event": "play",
                "data": {
                    "id" : "129378641982734",
                    "title": "Mission: Impossible - Rogue Nation",
                    "duration": 151,
                    "file": "https://s3.amazonaws.com/dev-multiscreen-video-library/trailers/MissionImpossible5_TLR-2_5.1-1080p-HDTN.mp4",
                },
                "to": "broadcast"
            }
        },

        "play (Star Wars) ": {
            "method": "ms.channel.emit",
            "params": {
                "event": "play",
                "data": {
                    "id" : "129378641982735",
                    "title": "Star Wars",
                    "duration": 212,
                    "file": "http://cdn.videos.dolimg.com/xd_shortform/sws/lf01077/d1097a-hlf01077_psws-sws_7-comic-con-2015-reel-h264m_aac_848x480_904x96.mp4",
                },
                "to": "broadcast"
            }
        },

        "play-paused-offset (Mission: Impossible - Rogue Nation) ": {
            "method": "ms.channel.emit",
            "params": {
                "event": "play",
                "data": {
                    "id" : "129378641982734",
                    "title": "Mission: Impossible - Rogue Nation",
                    "duration": 151,
                    "time": 100,
                    "state": "paused",
                    "file": "https://s3.amazonaws.com/dev-multiscreen-video-library/trailers/MissionImpossible5_TLR-2_5.1-1080p-HDTN.mp4",
                },
                "to": "broadcast"
            }
        },

        "stop": {
            "method": "ms.channel.emit",
            "params": {
                "event": "stop",
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

        "seek": {
            "method": "ms.channel.emit",
            "params": {
                "event": "seek",
                "data": 100,
                "to": "broadcast"
            }
        },

        "resume": {
            "method": "ms.channel.emit",
            "params": {
                "event": "resume",
                "to": "broadcast"
            }
        },

        "replay": {
            "method": "ms.channel.emit",
            "params": {
                "event": "replay",
                "to": "broadcast"
            }
        },

        "videoStart": {
            "method": "ms.channel.emit",
            "params": {
                "event": "videoStart",
                "data": "129378641982734",
                "to": "broadcast"
            }
        },

        "videoEnd": {
            "method": "ms.channel.emit",
            "params": {
                "event": "videoEnd",
                "data": "129378641982734",
                "to": "broadcast"
            }
        },

        "videoStatus": {
            "method": "ms.channel.emit",
            "params": {
                "event": "videoStatus",
                "data": {
                    title: "Mission: Impossible - Rogue Nation",
                    duration: 151,
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
                        title: "Mission: Impossible - Rogue Nation",
                        duration: 151,
                        id : "129378641982734",
                        time : "127",
                        state : "playing"
                    },
                },
                "to": "broadcast"
            }
        }
    };

    initUI();
});
