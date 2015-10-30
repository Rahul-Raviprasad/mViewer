'use strict';
angular.module('core').controller('ServerInfoController', ['$scope', '$http', '$location',
  function ($scope, $http, $location) {
$http({
  method: 'GET',
  url: '/getServerInfo',
}).then(function successCallback(response) {
   console.log(JSON.stringify(response));
}, function errorCallback(response) {
  console.log('failure');
});
  }
]);
