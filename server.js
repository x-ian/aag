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

var Vehicle = require('./models/vehicle');

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


/**
 * GET all vehicles
 */
app.get('/api/vehicles', function(req, res, next) {
  Vehicle.find()
    .exec(function(err, vehicles) {
      if (err) return next(err);

        return res.send(vehicles);
    });
});

/**
 * GET one vehicle
 */
app.get('/api/vehicles/:id', function(req, res) { 
  Vehicle.findOne({ _id : req.params.id }, function(error, vehicle) {
    if (error || !vehicle) {
      res.render('error', {});
    } else { 
      res.status('vehicle').send({ vehicle : vehicle });
    }
  });
});

/**
 * DELETE one vehicle
 */
app.delete('/api/vehicles/:id', function(req,res,next) {
  var id = req.params.id;
  Vehicle.findByIdAndRemove(id, function (error,vehicle){
    if (error || !vehicle) {
      res.render('error', {});
    } else { 
      res.status('vehicle').send({ vehicle : vehicle });
    }
  });
});

/**
 * PUT update existing vehicle
 */
app.put('/api/vehicles/:id', function(req, res) { 
  Vehicle.findOne({ _id : req.params.id }, function(error, vehicle) {
    if (error || !vehicle) {
      res.render('error', {});
    } else { 
      console.log(vehicle._id);
      var title = req.body.title;
      var description = req.body.description;
      // var classification = req.body.classification;
      // var vehicleDataRegistrationDate = req.body.vehicleDataRegistrationDate;
      // var vehicleDataCondition = req.body.vehicleDataCondition;
      // var vehicleDataNumberPreviousOwners = req.body.vehicleDataNumberPreviousOwners;
      // var vehicleDataHu = req.body.vehicleDataHu;
      // var vehicleDataSchadstoffklasse = req.body.vehicleDataSchadstoffklasse;
      // var vehicleDataUmweltplakette = req.body.vehicleDataUmweltplakette;
      // var damages = req.body.damages;

      vehicle.title = title;
      vehicle.description = description;
      vehicle.save(function(err) {
        if (err) {
          console.log('error)');
          return next(err);
        }
        console.log('done');
        res.send({ message: title + ' has been added successfully!' });
      });
    }
  });
});


/**
 * POST new vehicle
 */
app.post('/api/vehicles', function(req, res, next) {
  var title = req.body.title;
  var description = req.body.description;
  var classification = req.body.classification;
  var vehicleDataRegistrationDate = req.body.vehicleDataRegistrationDate;
  var vehicleDataCondition = req.body.vehicleDataCondition;
  var vehicleDataNumberPreviousOwners = req.body.vehicleDataNumberPreviousOwners;
  var vehicleDataHu = req.body.vehicleDataHu;
  var vehicleDataSchadstoffklasse = req.body.vehicleDataSchadstoffklasse;
  var vehicleDataUmweltplakette = req.body.vehicleDataUmweltplakette;
  var damages = req.body.damages;

    var vehicle = new Vehicle({
      title: title,
      description: description,
      classification: classification,
      vehicleData: {
        registrationDate: vehicleDataRegistrationDate,
        condition: vehicleDataCondition,
        numberPreviousOwners: vehicleDataNumberPreviousOwners,
        hu: vehicleDataHu,
        schadstoffklasse: vehicleDataSchadstoffklasse,
        umweltplakette: vehicleDataUmweltplakette
      },
      damages: damages
    });

    vehicle.save(function(err) {
      if (err) return next(err);
      res.send({ message: title + ' has been added successfully!' });
    });
});




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
var server = require('http').createServer(app);

var io = require('socket.io')(server);
var onlineUsers = 0;

io.sockets.on('connection', function(socket) {
  onlineUsers++;

  io.sockets.emit('onlineUsers', { onlineUsers: onlineUsers });

  socket.on('disconnect', function() {
    onlineUsers--;
    io.sockets.emit('onlineUsers', { onlineUsers: onlineUsers });
  });
});

server.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));

  // just for development 
  var osascript = require('node-osascript');
  osascript.execute("display notification \"aag (re)started\" with title \"nodemon\"");
  osascript.execute("beep 1");
  // function(err, result, raw){
  //   if (err) return console.error(err);
  //   console.log(result, raw);
  // });

});
