var express = require('express');
var compression = require('compression');
var proxy = require('express-http-proxy');
var API_HOST = process.env.API_HOST || 'localhost'
var PORT = process.env.PORT || 5000;

// Initialize
var app = express();
var apiProxy = httpProxy.createProxyServer();

// Serve static resources from 'build' folder
app.use(express.static(__dirname + '/client/build'));

// Enable gzip response compression
app.use(compression());

// Proxy all the api requests
app.use('/trips', proxy('https://' + API_HOST, {
  https: true
}));

// Otherwise serve index.html
app.get('*', function (req, res) {
  console.log("GOTCHA GET");
  console.log(req);
  res.sendFile(__dirname + '/client/build/index.html');
});

app.listen(PORT);

console.log('Running on port ' + PORT + ' with API_HOST:' + API_HOST);


