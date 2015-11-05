'use strict';
var MongoClient = require('mongodb').MongoClient;
var _ = require('lodash');
var dbInstance = null;
var connectionList = [];
/**
 * Render the main application page
 */
exports.renderIndex = function (req, res) {
  res.render('modules/core/server/views/index', {
    user: req.user || null
  });
};

var addConnection = function (dbName, db) {
  var connection = _.find(connectionList, dbName);
  if (connection) {
    return;
  }
  var obj = {};
  obj[dbName] = db;
  connectionList.push(obj);
  console.log('total connections:-')
  console.log(connectionList);
};

var removeConnection = function(dbName) {
  _.remove(connectionList, function(connection) {
     if (connection[dbName]) { return true };
  });
  console.log('after removal of connection:-')
  console.log(connectionList);
}

var getConnection = function(dbName) {
  var connection = _.find(connectionList, dbName).dbName;

  //if connection to the db is not found, create one and return the instance
  if (!connection) {
    connectToDB('localhost', 27017, dbName, function(err, db){
      connection = db;
    });
  }
  console.log('got connection:-')
  console.log(connection);
  return connection;
}

var insertDocument = function(db, collection, document, callback) {
   db.collection(collection).insertOne(document, function(err, result) {
    callback(err, result);
  });
};

var updateDocument = function(db, collection, existingDoc, newDocument, callback) {
  db.collection(collection).updateOne(existingDoc, newDocument,  {upsert:true, w: 1}, function(err, result){
    callback(err, result);
  });
}

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
 db.createCollection(collectionName, {capped:true, size:10000, max:1000, w:1}, function(err, collection) {
   callback(err, collection);
 });
};

var renameCollection = function(db, oldCollectionName, newCollectionName, callback) {
  db.renameCollection(oldCollectionName, newCollectionName, function(err, newCollection){
    callback(err, newCollection);
  });
};

var dropCollection = function(db, collectionName, callback) {
  db.collection(collectionName).drop(function(err, reply) {
    callback(err, reply);
  });
};

var dropDatabase = function(dbName, db, callback) {
  db.dropDatabase(function(err, result){
    removeConnection(dbName);
    callback(err, result);
  });
}

var getDBStats = function(db, callback) {
  db.stats(function(err, stats){
    callback(err, stats);
  });
};

var getCollectionStats = function(db, collectionName, callback) {
  db.collection(collectionName).stats(function(err, stats){
    callback(err, stats);
  });
};

var listDatabases = function(db, callback) {
  // List all the available databases
  db.admin().listDatabases(function(err, dbs) {
    callback(err, dbs.databases);
  });
};

var addUser = function(db, user, password, callback) {
  db.addUser(user, password, function(err, result){
    callback(err, result);
  });
};

var removeUser = function(db, user, callback) {
  db.removeUser(user, function(err, result){
    callback(err, result);
  });
};

var getServerInfo = function(db, callback) {
  db.admin().serverStatus(function(err, info) {
    callback(err, info);
    db.close();
  });
};

var closeDatabase = function(db, callback) {
  db.close(true, function(err, result) {
    callback(err, result);
  });
};

var connectToDB = function(host, port, databases, callback) {
  var url = 'mongodb://' + host + ':' + port + '/' + (databases != 'undefined' ? databases : '');
  console.log(url);
  MongoClient.connect(url, function(err, db) {
    console.log('connected to syam');
    addConnection(databases, db);
    callback(err, db);
  });
};

exports.apis = {
  getServerInfo: getServerInfo,
  closeDatabase: closeDatabase,
  addUser: addUser,
  removeUser: removeUser,
  getDBStats: getDBStats,
  getCollectionStats: getCollectionStats,
  dropDatabase: dropDatabase,
  dropCollection: dropCollection,
  renameCollection: renameCollection,
  updateDocument: updateDocument,
  listDatabases: listDatabases,
  listCollections: listCollections,
  listDocuments: listDocuments,
  createCollection: createCollection,
  insertDocument: insertDocument,
  connectToDB: connectToDB,
  getConnection: getConnection
};

exports.createConnection = function (req, res) {
  var host = req.query.host, port = req.query.port,
      userName = req.query.userName, password = req.query.password, databases = req.query.databases;
      if (databases == 'undefined' || databases == '') {
        databases = 'test';
      }

  var url = 'mongodb://' + (userName != 'undefined' ? (userName + ':') : '') + (password != 'undefined' ? (password + '@') : '') + host + ':' + port + '/' + databases;
  MongoClient.connect(url, function(err, db) {
    if (err || db == null) {
      res.json({error: 'Couln\'t connect to mongo: ' + err});
      // error and meaning
      //MongoError: Authentication failed. when username or password is invalid
      //MongoError: connect ECONNREFUSED   when port is wrong
      //MongoError: connect getaddrinfo ENOTFOUND   when host is wrong
      return;
    }
    addConnection(databases, db);
    module.exports.dbInstance = db; // save the db instance for later use; TODO - Use session
    res.send('connection successful');
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
