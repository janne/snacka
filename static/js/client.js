function initialize() {
  if (!easyrtc.supportsGetUserMedia()) {
    $('#status').html("Your browser has no access to the microphone. Please use Google Chrome, Mozilla Firefox or Opera browser.");
    return;
  }

  easyrtc.enableVideo(false);

  // Setup media source
  easyrtc.initMediaSource(function() {
    easyrtc.connect("snacka", function(id) {
      console.log("Id: " + id);
      updateStatus();
    }, connectFailure);
  }, connectFailure);
  var connectFailure = function(errorCode, errText) {
    $('#status').html(errText);
  }

  // Call everybody
  easyrtc.setRoomOccupantListener(function(room, others) {
    easyrtc.setRoomOccupantListener(false);
    for(var id in others) {
      easyrtc.call(id);
    }
  });
}

easyrtc.setStreamAcceptor( function(id, stream) {
  $('#videos').append("<video id='" + id + "'></video>");
  var video = document.getElementById(id);
  easyrtc.setVideoObjectSrc(video, stream);
  updateStatus();
  console.log("Connected: " + id);
});

easyrtc.setOnStreamClosed(function (id) {
  var video = document.getElementById(id);
  easyrtc.setVideoObjectSrc(video, "");
  $(video).remove();
  $('#count').html($('video').length);
  console.log("Disconnected: " + id);
});

function updateStatus() {
  var count = $('video').length;
  var status = "You are alone here.";
  if (count > 0) {
    status = "There are " + count + " more people in this room.";
  }
  $('#status').html(status);
}
