var maxCALLERS = 10;

function initialize() {
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

easyrtc.setStreamAcceptor( function(callerEasyrtcid, stream) {
  var video = document.getElementById('caller');
  easyrtc.setVideoObjectSrc(video, stream);
});

easyrtc.setOnStreamClosed( function (callerEasyrtcid) {
  easyrtc.setVideoObjectSrc(document.getElementById('caller'), "");
});

function roomListener(roomName, otherPeers) {
  var list = [];
  var connectCount = 0;

  for(var easyrtcid in otherPeers ) {
      list.push(easyrtcid);
  }

  function establishConnection(position) {
    easyrtc.call(list[position], callSuccess, callFailure, callAccepted);
    function callSuccess() {
      console.log("Completed call to " + list[position]);
      connectCount++;
      if (connectCount < maxCALLERS && position > 0) {
        establishConnection(position-1);
      }
    }
    function callFailure(errorCode, errorText) {
      console.log("err:" + errorText);
      if (connectCount < maxCALLERS && position > 0) {
        establishConnection(position-1);
      }
    }
    function callAccepted(accepted, bywho) {
      console.log((accepted ? "Accepted" : "Rejected")+ " by " + bywho);
    }
  }

  if(list.length > 0) {
    establishConnection(list.length-1);
  }
}

function performCall(easyrtcid) {
  easyrtc.call(easyrtcid,
    function(easyrtcid) { console.log("Completed call to " + easyrtcid);},
    function(errorCode, errorText) { console.log("err:" + errorText);},
    function(accepted, bywho) {
      console.log((accepted ? "Accepted" : "Rejected")+ " by " + bywho);
    }
  );
}
