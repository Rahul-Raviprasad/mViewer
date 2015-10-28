'use strict';
var MongoClient = require('mongodb').MongoClient;

/**
 * Render the main application page
 */
exports.renderIndex = function (req, res) {
  res.render('modules/core/server/views/index', {
    user: req.user || null
  });
};

var insertDocument = function(db, collection, document, callback) {
   db.collection(collection).insertOne(document, function(err, result) {
    callback(err, result);
  });
};

var listDocuments = function(db, collection, callback) {
  db.collection(collection).find().toArray(function(err, docs) {
    callback(err, docs);
  });
};

var listCollections = function(db, callback) {
  db.listCollections().toArray(function(err, collections) {
    callback(err, collections);
  });
};

var createCollection = function(db, collectionName, callback) {
  // Create a capped collection with a maximum of 1000 documents
 db.createCollection(collectionName, {capped:true, size:10000, max:1000, w:1}, function(err, collection) {
   callback(err, collection);
 });
}

var listDatabases = function(db, callback) {
  // List all the available databases
  db.admin().listDatabases(function(err, dbs) {
    callback(err, dbs.databases);
    db.close();
  });
}

var getServerInfo = function(db, callback) {
  db.admin().serverStatus(function(err, info) {
    callback(err, info);
    db.close();
  });
}

exports.createConnection = function (req, res) {
  var host = req.query.host, port = req.query.port,
      userName = req.query.userName, password = req.query.password, databases = req.query.databases;

  var url = 'mongodb://' + (userName != 'undefined' ? (userName + ':') : '') + (password != 'undefined' ? (password + '@') : '') + host + ':' + port + '/' + (databases != 'undefined' ? databases : '');
  console.log(url);
  MongoClient.connect(url, function(err, db) {
    if (err || db == null) {
      res.json({error: 'Couln\'t connect to mongo: ' + err});
      // error and meaning
      //MongoError: Authentication failed. when username or password is invalid
      //MongoError: connect ECONNREFUSED   when port is wrong
      //MongoError: connect getaddrinfo ENOTFOUND   when host is wrong
      return;
    }
    console.log("Connected correctly to server.");
    // db.listCollections(function(err, collections){
    //   console.log('success');
    //   res.json({data: collections});
    // });
    //db.close();
    //  insertDocument(db,'restaurants', {
    //    "address" : {
    //       "street" : "2 Avenue",
    //       "zipcode" : "10075",
    //       "coord" : [ -73.9557413, 40.7720266 ]
    //    },
    //    "cuisine" : "Italian",
    //    "grades" : [
    //       {
    //          "date" : new Date("2014-10-01T00:00:00Z"),
    //          "grade" : "A",
    //          "score" : 11
    //       }
    //    ],
    //    "name" : "Vella",
    //    "restaurant_id" : "41704620"
    // },function(err, result) {
    //   //db.close();
    //   console.log('insertion successful'+ result);
    // });

    // listDocuments(db, 'restaurants', function(err, documents){
    //   console.log('found documents'+ documents);
    //   res.json({data: documents});
    //   db.close();
    // });

    createCollection(db, 'testing', function(err, collection){
      console.log('create collection');
    });
    listCollections(db, function(err, collections){
       console.log('found collections');
       res.json(collections);
    });

    // listDatabases(db, function(err, databases){
    //    console.log('found databases');
    //    res.json({data: databases});
    // });

    // getServerInfo(db, function(err, info) {
    //   if (err) {
    //     res.json({error: err});
    //   }
    //   console.log('server Info:');
    //   res.json(info);
    // })
  });
};
/**
 * Render the server error page
 */
exports.renderServerError = function (req, res) {
  res.status(500).render('modules/core/server/views/500', {
    error: 'Oops! Something went wrong...'
  });
};

/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
exports.renderNotFound = function (req, res) {

  res.status(404).format({
    'text/html': function () {
      res.render('modules/core/server/views/404', {
        url: req.originalUrl
      });
    },
    'application/json': function () {
      res.json({
        error: 'Path not found'
      });
    },
    'default': function () {
      res.send('Path not found');
    }
  });
};
