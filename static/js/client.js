function initialize() {
  easyrtc.enableVideo(false);
  easyrtc.setRoomOccupantListener(roomListener);
  var connectSuccess = function(myId) {
    console.log("My easyrtcid is " + myId);
  }

  var connectFailure = function(errorCode, errText) {
    console.log(errText);
  }

  easyrtc.initMediaSource(function() {
    easyrtc.connect("snackanet", connectSuccess, connectFailure);
  }, connectFailure);
}

function roomListener(roomName, otherPeers) {
  easyrtc.setRoomOccupantListener(false); // Only do this on startup
  for(var easyrtcid in otherPeers ) {
    easyrtc.call(easyrtcid);
  }
}

easyrtc.setStreamAcceptor( function(callerEasyrtcid, stream) {
  $('#videos').append("<video id='" + callerEasyrtcid + "'></video>");
  var video = document.getElementById(callerEasyrtcid);
  easyrtc.setVideoObjectSrc(video, stream);
  $('#count').html($('video').length);
  console.log("Connected: " + callerEasyrtcid);
});

easyrtc.setOnStreamClosed( function (callerEasyrtcid) {
  var video = document.getElementById(callerEasyrtcid);
  easyrtc.setVideoObjectSrc(video, "");
  $(video).remove();
  $('#count').html($('video').length);
  console.log("Disconnected: " + callerEasyrtcid);
});

