var SalesDocument = require('../models/salesdocument');

module.exports = function (app) {

  /**
   * GET all salesdocuments
   */
  app.get('/api/salesdocuments', function(req, res, next) {
    SalesDocument.find(function(err, item) {
      if (err || !item) return next(err);
      // return res.send(item);
      return res.json(item);
    });
  });

  /**
   * GET one SalesDocument
   */
  app.get('/api/salesdocuments/:id', function(req, res, next) { 
    SalesDocument.findById(req.params.id, function(err, item) {
      if (err || !item) return next(err);
      return res.json(item);
    });
  });

  /**
   * DELETE one SalesDocument
   */
  app.delete('/api/salesdocuments/:id', function(req,res,next) {
    SalesDocument.findByIdAndRemove(req.params.id, function (err, item){
      if (err || !item) return next(err);
      // return res.json(item);
      return res.json({ message: 'Item deleted' });
    });
  });

  /**
   * PUT update existing SalesDocument
   */
  app.put('/api/salesdocuments/:id', function(req, res, next) { 
    SalesDocument.findByIdAndUpdate(req.params.id, req.body, function(err, item) {
      if (err || !item) return next(err);
      //return res.json(item);
      return res.json({ message: 'Item updated' });
    });
  });

  /**
   * POST new SalesDocument
   */
  app.post('/api/salesdocuments', function(req, res, next) {
    SalesDocument.create(req.body, function (err, item) {
      if (err || !item) return next(err);
      // return res.json(item);
      return res.json({ message: 'Item added' });
    });
  });

}
