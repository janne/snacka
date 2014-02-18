// Load required modules
var http    = require("http");              // http server core module
var express = require("express");           // web framework external module
var io      = require("socket.io");         // web socket external module
var easyrtc = require("easyrtc");           // EasyRTC external module

// Setup and configure Express http server. Expect a subfolder called "static" to be the web root.
var app = express();

function requireHTTPS(req, res, next) {
  var secure = req.headers['x-forwarded-proto'] && req.headers['x-forwarded-proto'] === "https";
  var local = (/^localhost/).test(req.get('host'));
  if (!secure && !local) {
    return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
}
app.use(requireHTTPS);

app.configure(function() {
  app.use(express.static(__dirname + "/static/"));
});

// Start Express http server on port 8080
var port = Number(process.env.PORT || 8080);
var webServer = http.createServer(app).listen(port);

// Start Socket.io so it attaches itself to Express server
var socketServer = io.listen(webServer, {"log level":1});

// Start EasyRTC server
var rtc = easyrtc.listen(app, socketServer);
