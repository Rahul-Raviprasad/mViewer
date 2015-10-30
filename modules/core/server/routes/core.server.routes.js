'use strict';

module.exports = function (app) {
  // Root routing
  var core = require('../controllers/core.server.controller');

  // Define error pages
  app.route('/server-error').get(core.renderServerError);

  // Return a 404 for all undefined api, module or lib routes
  app.route('/:url(api|modules|lib)/*').get(core.renderNotFound);
  app.route('/connectMongo').get(core.createConnection);

  //Api routes

  app.route('/listDatabases').get(function(req, res){
    //console.log('db instance'+ req.session.dbInstance);
    core.apis.listDatabases(core.dbInstance, function(err, databases){
      if (err) {
        res.json({error: err});
      }
      res.json({data: databases});
    });
  });

  app.route('/listCollections').get(function(req, res) {
    core.apis.listCollections(core.dbInstance, function(err, collections){
      if(err) {
        res.json({error: err});
      }
      res.json({data: collections});
    });
  });

  app.route('/listDocuments').get(function(req, res) {
    var collection = req.query.collection;
    console.log(collection);
    core.apis.listDocuments(core.dbInstance, collection, function(err, documents){
      if(err) {
        res.json({error: err});
      }
      res.json({data: documents});
    });
  });

  // Define application route
  app.route('/home').get(core.renderIndex);
};
