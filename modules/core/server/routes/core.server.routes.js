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
    var databaseName = req.query.databaseName;
    var dbInstance = core.apis.getConnection(databaseName);
    core.apis.listDatabases(dbInstance, function(err, databases){
      if (err) {
        res.json({error: err});
      }
      res.json(databases);
    });
  });

  app.route('/listCollections').get(function(req, res) {
    var databaseName = req.query.databaseName;
    var dbInstance = core.apis.getConnection(databaseName);
    core.apis.listCollections(dbInstance, function(err, collections){
      if(err) {
        res.json({error: err});
      }
      res.json({data: collections});
    });
  });

  app.route('/listDocuments').get(function(req, res) {
    var databaseName = req.query.databaseName;
    var dbInstance = core.apis.getConnection(databaseName);
    var collection = req.query.collection;
    console.log(collection);
    core.apis.listDocuments(dbInstance, collection, function(err, documents){
      if(err) {
        res.json({error: err});
      }
      res.json({data: documents});
    });
  });

  app.route('/createCollection').post(function(req, res) {
    var databaseName = req.query.databaseName;
    var dbInstance = core.apis.getConnection(databaseName);
    var collectionName = req.query.collectionName;
    core.apis.createCollection(dbInstance, collectionName, function(err, collection){
      if(err) {
        res.json({error: err});
      }
      res.json({data: collection});
    });
  });

  app.route('/renameCollection').post(function(req, res) {
    var collectionOldName = req.query.collectionOldName,
        collectionNewName = req.query.collectionNewName;
        var databaseName = req.query.databaseName;
        var dbInstance = core.apis.getConnection(databaseName);

    core.apis.renameCollection(dbInstance, collectionOldName, collectionNewName, function(err, collection){
      if(err) {
        res.json({error: err});
      }
      res.json({data: collection});
    });
  });

  app.route('/insertDocument').post(function(req, res) {
    var databaseName = req.query.databaseName;
    var dbInstance = core.apis.getConnection(databaseName);
    var collection = req.query.collection, document = req.query.document;
    core.apis.insertDocument(dbInstance, collection, document, function(err, result) {
      if(err) {
        res.json({error: err});
      }
      res.json({data: result});
     });
  });

  app.route('/updateDocument').post(function(req, res) {

  });

  app.route('/connectToDB').get(function(req, res) {
    var databaseName = req.query.databaseName;
    core.apis.connectToDB('localhost', 27017, databaseName, function(err, db){
      if(err) {
        res.json({error: err});
      }
      res.send('connection successful');
    });
  });

  app.route('/dropDatabase').post(function(req, res) {
    var databaseName = req.query.databaseName;
    var dbInstance = core.apis.getConnection(databaseName);
    core.apis.dropDatabase(databaseName, dbInstance, function(err, result){
      if(err) {
        res.json({error: err});
      }
      console.log(result);
      res.send('operation successful');
    })
  })


  // Define application route
  app.route('/*').get(core.renderIndex);
};
