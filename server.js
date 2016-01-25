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

// CRUD access for DB documents
require('./routes/api-auctions')(app);
require('./routes/api-auctionitems')(app);
require('./routes/api-bids')(app);
require('./routes/api-users')(app);
require('./routes/api-vehicles')(app);
require('./routes/live-common')(app, io);
require('./routes/live-bidder')(app, io);
require('./routes/live-promoter')(app, io);

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

/**
 * Socket.io stuff.
 */
io.sockets.on('connection', function(socket) {
  console.log('socket connected');
  // Bid.find(function(err, item) {
  //   if (err || !item) return next(err);
  //   // return res.send(item);
  //
  //   {bid.sequenceNumber} - {bid.amount} - {bid.status} - {bid.timestamp} - {bid.user.name}
  //
  //   return res.json({
  //     _id: item._id;
  //     amount: item.amount;
  //     status: item.status;
  //     timestamp: item.timestamp;
  //     sequenceNumber:
  //   });
  // });

  io.sockets.emit('recentBid', {
    _id: 123,
    amount: 200,
    status: 'accepted',
    timestamp: new Date(),
    sequenceNumber: 1,
    user: { name: 'ichichich'}
  });

  // socket.on('disconnect', function() {
  //   onlineUsers--;
  //   io.sockets.emit('onlineUsers', { onlineUsers: onlineUsers });
  // });

});

// var io  = require('socket.io')(http, { path: '/myapp/socket.io'});

io.of('/my-namespace')
  .on('connection', function(socket){
    console.log('a user connected with id %s', socket.id);
    onlineUsers++;
    onlineUsers++;
    onlineUsers++;
    onlineUsers++;

    io.sockets.emit('onlineUsers', { onlineUsers: onlineUsers });

    socket.on('disconnect', function() {
      onlineUsers--;
      onlineUsers--;
      onlineUsers--;
      onlineUsers--;
      io.sockets.emit('onlineUsers', { onlineUsers: onlineUsers });
    });

    // socket.on('my-message', function (data) {
    //     io.of('my-namespace').emit('my-message', data);
    //     // or socket.emit(...)
    //     console.log('broadcasting my-message', data);
    // });
});

server.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));

  // just for development to notify about server restart
  var osascript = require('node-osascript');
  osascript.execute("display notification \"aag (re)started\" with title \"nodemon\"");
  osascript.execute("beep 1");
});
