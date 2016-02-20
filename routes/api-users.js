var User = require('../models/user');

module.exports = function (app) {

  /**
   * GET all users
   */
  app.get('/api/users', function(req, res, next) {
    User.find(function(err, item) {
      if (err || !item) return next(err);
      return res.json(item);
    });
  });

  /**
   * GET one user
   */
  app.get('/api/users/:id', function(req, res, next) { 
    User.findById(req.params.id, function(err, item) {
      if (err || !item) return next(err);
      return res.json(item);
    });
  });

  /**
   * DELETE one user
   */
  app.delete('/api/users/:id', function(req,res,next) {
    User.findByIdAndRemove(req.params.id, function (err, item){
      if (err || !item) return next(err);
      // return res.json(item);
      return res.json({ message: 'Item deleted' });
    });
  });

  /**
   * PUT update existing user
   */
  app.put('/api/users/:id', function(req, res, next) { 
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
      // return res.json(item);
      return res.json({ message: 'Item added' });
    });
  });

}
