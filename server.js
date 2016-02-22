// Babel ES6/JSX Compiler
require('babel-register');

var log = require('./lib/log');
var path = require('path');

var async = require('async');

var mongoose = require('mongoose');
var configDatabase = require('./config/database');
mongoose.connect(configDatabase.url);
mongoose.connection.on('error', function() {
  log.error('Error: Could not connect to MongoDB. Did you forget to run `mongod`?');
});

var express = require('express');
var bodyParser = require('body-parser');
var swig  = require('swig');
var passport = require("passport");
var app = express();
app.set('port', process.env.PORT || 3000);
app.use(require('compression')());
app.use(require('morgan')('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('cookie-parser')());
app.use(require('serve-favicon')(path.join(__dirname, 'public', 'favicon.png')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('express-session')({ secret: 'SECRET', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

require('./lib/passport')(passport); // pass passport for configuration


var React = require('react');
var ReactDOM = require('react-dom/server');
var Router = require('react-router');
var routes = require('./app/routes');

var server = require('http').createServer(app);
var io = require('socket.io')(server);
var auction = io.of('/auction');
var socketPromoter = io.of('/promoter');


var BidQueue = require('./models/bidqueue');
var bidQueueActive = false;
var bidQueueStream = BidQueue.find().tailable(true, {awaitdata: true, numberOfRetries:  Number.MAX_VALUE}).stream();
function isBidQueueActive() {
  log.debug('isBidQueueActive ' + bidQueueActive);
  return bidQueueActive;
}
function activateBidQueue() {
  bidQueueActive = true;
  log.debug('activateBidQueue ' + bidQueueActive);
}
function deactivateBidQueue() {
  bidQueueActive = false;
  log.debug('deactivateBidQueue ' + bidQueueActive);
}

var clients = new Object();
require('./routes/api-auctions')(app);
require('./routes/api-auctionitems')(app);
require('./routes/api-bids')(app);
require('./routes/api-users')(app);
require('./routes/api-vehicles')(app);
require('./routes/common')(app, this);
require('./routes/live-common')(app, auction, clients, bidQueueStream);
require('./routes/live-bidder')(app, auction, bidQueueStream, activateBidQueue);
require('./routes/live-promoter')(app, auction, bidQueueStream, deactivateBidQueue);
require('./routes/live-bidqueue')(app, socketPromoter, auction, bidQueueStream, isBidQueueActive);

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
  log.error(err);
  log.error(err.stack);
  res.status(err.status || 500);
  res.send({ message: err.message });
});

// maybe volatile on namespaces/rooms doesn't properly work
// https://github.com/socketio/socket.io/issues/1741
// https://github.com/socketio/socket.io/issues/1952
// http://stackoverflow.com/questions/25265860/socketio-volatile-emit-to-namespace
// moved into dedicated namespace
// socket.on('producer audio chunk', function(msg){
//   log.info('volatile emit');
//   io.volatile.emit('consumer audio chunk', msg);
//   // socket.emit('consumer audio chunk', msg);
// });
var audio = io.of('/audio-stream');
audio.on('connection', function(socket){
    log.info('connected to audio stream with id %s', socket.id);

    socket.on('producer audio chunk', function(msg){
      audio.volatile.emit('consumer audio chunk', msg);
    });
    socket.on('disconnect', function() {
      log.info('disconnected from audio stream with id %s', socket.id);
    });
});

/**
 * Socket.io stuff.
 */
// io.sockets.on('connection', function(socket) {
var auction = io.of('/auction');
auction.on('connection', function(socket){
  log.info('connected to auction with id %s', socket.id);

  clients[socket.id] = { id: socket.id, ip: socket.request.connection.remoteAddress, userAgent: socket.request.headers['user-agent']};
  var keys = Object.keys(clients);
  var values = keys.map(function(v) { return clients[v]; });
  auction.emit('participants', values);

  // for (key in socket.request.headers) {
  //   log.info(key);
  //   log.info(socket.request.headers[key]);
  // }
    // var url = 'http://freegeoip.net/json/' + socket.request.connection.remoteAddress
    // request.get url, (error, response, body) ->
    //   if !error && response.statusCode == 200
    //     data = JSON.parse body
    //     location data

  socket.on('disconnect', function() {
    log.info('disconnected from auction with id %s', socket.id);
    clients[socket.id] = null;
    delete(clients[socket.id]);
    var keys2 = Object.keys(clients);
    var values2 = keys2.map(function(v) { return clients[v]; });
    auction.emit('participants', values2);
  });

});

server.listen(app.get('port'), function() {
  log.info('Express server listening on port ' + app.get('port'));

  // just for development to notify about server restart
  var osascript = require('node-osascript');
  osascript.execute("display notification \"aag (re)started\" with title \"nodemon\"");
  osascript.execute("beep 1");
});
