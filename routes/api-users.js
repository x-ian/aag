var auth = require('../lib/auth');
var log = require('../lib/log');
var User = require('../models/user');

module.exports = function (app) {

  /**
   * GET all users
   */
  app.get('/api/users', auth.isLoggedInUser, function(req, res, next) {
    User.find(function(err, item) {
      if (err || !item) return next(err);
      return res.json(item);
    });
  });

  /**
   * GET one user
   */
  app.get('/api/users/:id', auth.isLoggedInUser, function(req, res, next) { 
    User.findById(req.params.id, function(err, item) {
      if (err || !item) return next(err);
      return res.json(item);
    });
  });

  /**
   * DELETE one user
   */
  app.delete('/api/users/:id', auth.isLoggedInUser, function(req,res,next) {
    User.findByIdAndRemove(req.params.id, function (err, item){
      if (err || !item) return next(err);
      // return res.json(item);
      return res.json({ message: 'Item deleted' });
    });
  });

  /**
   * PUT update existing user
   */
  app.put('/api/users/:id', auth.isLoggedInUser, function(req, res, next) { 
    User.findByIdAndUpdate(req.params.id, req.body, function(err, item) {
      if (err || !item) return next(err);
      //return res.json(item);
      return res.json({ message: 'Item updated' });
    });
  });

  /**
   * POST new user
   */
  app.post('/api/users', function(req, res, next) {
    User.create(req.body, function (err, item) {
      if (err || !item) return next(err);
      item.createdAt = new Date();
      log.debug(req.body);
      item.password = item.generateHash(req.body.password);
      item.passwordCleartext = req.body.password;
      item.save();
      // return res.json(item);
      return res.json({ message: 'Item added' });
    });
  });

}
