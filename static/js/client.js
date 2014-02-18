function initialize() {
  if (!easyrtc.supportsGetUserMedia()) {
    $('#status').html("Your browser has no access to the microphone. Please use Google Chrome, Mozilla Firefox or Opera browser.");
    return;
  }
  easyrtc.enableVideo(false);
  easyrtc.setRoomOccupantListener(roomListener);

  var connectSuccess = function(myId) {
    console.log("My easyrtcid is " + myId);
    updateStatus();
  }
  var connectFailure = function(errorCode, errText) {
    $('#status').html(errText);
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
  updateStatus();
  console.log("Connected: " + callerEasyrtcid);
});

function updateStatus() {
  var count = $('video').length;
  var status = "You are alone here.";
  if (count > 0) {
    status = "There are " + count + " more people in this room.";
  }
  $('#status').html(status);
}

easyrtc.setOnStreamClosed( function (callerEasyrtcid) {
  var video = document.getElementById(callerEasyrtcid);
  easyrtc.setVideoObjectSrc(video, "");
  $(video).remove();
  $('#count').html($('video').length);
  console.log("Disconnected: " + callerEasyrtcid);
});

