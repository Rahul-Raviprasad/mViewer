'use strict';
//var mongoose = require('./mongoose'), Admin = mongoose.mongo.Admin;
angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$http', '$location',
  function ($scope, Authentication, http, location) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
$scope.host = "127.0.0.1";
$scope.port = 27017;
    $scope.connectToMongo = function () {
      http({
  method: 'GET',
  url: '/connectMongo' + '?host='+ $scope.host + '&port='+ $scope.port + '&userName=' + $scope.userName + '&password=' + $scope.password + '&databases=' + $scope.databases,
}).then(function successCallback(response) {
    // this callback will be called asynchronously
    // when the response is available
    console.log('connection success'+ JSON.stringify(response));
    location.path('/main');
  }, function errorCallback(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
    console.log('failure');
  });
    }
  }
]);
