// Babel ES6/JSX Compiler
require('babel-register');

var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var compression = require('compression');
var favicon = require('serve-favicon');
var logger = require('morgan');
var async = require('async');
var colors = require('colors');
var mongoose = require('mongoose');
var request = require('request');
var React = require('react');
var ReactDOM = require('react-dom/server');
var Router = require('react-router');
var swig  = require('swig');
var xml2js = require('xml2js');
var _ = require('underscore');

var config = require('./config');

var routes = require('./app/routes');

var app = express();

var clients = new Object();

mongoose.connect(config.database);
mongoose.connection.on('error', function() {
  console.info('Error: Could not connect to MongoDB. Did you forget to run `mongod`?'.red);
});

app.set('port', process.env.PORT || 3000);
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(express.static(path.join(__dirname, 'public')));

var server = require('http').createServer(app);
var io = require('socket.io')(server);
var auction = io.of('/auction');

// CRUD access for DB documents
require('./routes/api-auctions')(app);
require('./routes/api-auctionitems')(app);
require('./routes/api-salesdocuments')(app);
require('./routes/api-bids')(app);
require('./routes/api-users')(app);
require('./routes/api-vehicles')(app);
require('./routes/live-common')(app, auction, clients);
require('./routes/live-bidder')(app, auction);
require('./routes/live-promoter')(app, auction);

app.use(function(req, res) {
  Router.match({ routes: routes.default, location: req.url }, function(err, redirectLocation, renderProps) {
    if (err) {
      res.status(500).send(err.message)
    } else if (redirectLocation) {
      res.status(302).redirect(redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
        var html = ReactDOM.renderToString(React.createElement(Router.RoutingContext, renderProps));
        var page = swig.renderFile('views/index.html', { html: html });
        res.status(200).send(page);
    } else {
      res.status(404).send('Page Not Found')
    }
  });
});

app.use(function(err, req, res, next) {
  console.log(err.stack.red);
  res.status(err.status || 500);
  res.send({ message: err.message });
});

// maybe volatile on namespaces/rooms doesn't properly work
// https://github.com/socketio/socket.io/issues/1741
// https://github.com/socketio/socket.io/issues/1952
// http://stackoverflow.com/questions/25265860/socketio-volatile-emit-to-namespace
// moved into dedicated namespace
// socket.on('producer audio chunk', function(msg){
//   console.log('volatile emit');
//   io.volatile.emit('consumer audio chunk', msg);
//   // socket.emit('consumer audio chunk', msg);
// });
var audio = io.of('/audio-stream');
audio.on('connection', function(socket){
    console.log('connected to audio stream with id %s', socket.id);

    socket.on('producer audio chunk', function(msg){
      audio.volatile.emit('consumer audio chunk', msg);
    });
    socket.on('disconnect', function() {
      console.log('disconnected from audio stream with id %s', socket.id);
    });
});

/**
 * Socket.io stuff.
 */
// io.sockets.on('connection', function(socket) {
var auction = io.of('/auction');
auction.on('connection', function(socket){
  console.log('connected to auction with id %s', socket.id);

  clients[socket.id] = { id: socket.id, ip: socket.request.connection.remoteAddress, userAgent: socket.request.headers['user-agent']};
  var keys = Object.keys(clients);
  var values = keys.map(function(v) { return clients[v]; });
  auction.emit('participants', values);

  // for (key in socket.request.headers) {
  //   console.log(key);
  //   console.log(socket.request.headers[key]);
  // }
    // var url = 'http://freegeoip.net/json/' + socket.request.connection.remoteAddress
    // request.get url, (error, response, body) ->
    //   if !error && response.statusCode == 200
    //     data = JSON.parse body
    //     location data

  socket.on('disconnect', function() {
    console.log('disconnected from auction with id %s', socket.id);
    clients[socket.id] = null;
    delete(clients[socket.id]);
    var keys2 = Object.keys(clients);
    var values2 = keys2.map(function(v) { return clients[v]; });
    auction.emit('participants', values2);
  });

});

server.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));

  // just for development to notify about server restart
  var osascript = require('node-osascript');
  osascript.execute("display notification \"aag (re)started\" with title \"nodemon\"");
  osascript.execute("beep 1");
});
