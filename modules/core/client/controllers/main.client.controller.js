'use strict';
angular.module('core').controller('ModalInstanceCtrl', function ($scope, $modalInstance, $http) {
  $scope.ok = function () {
    $http({
      method: 'GET',
      url: '/connectToDB?database='+ $scope.databaseName,
    }).then(function successCallback(response) {
       console.log('connected to'+ $scope.databaseName);
     }, function errorCallback(response) {
       console.log(response);
     });
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
})

angular.module('core').controller('MainController', ['$scope', '$http', '$location', '$modal',
  function ($scope, $http, $location, $uibModal) {

    $http.get('http://localhost:3001/listDatabases').success(function(response){
      console.log(response);
      $scope.dbListArray = response.data; 
    });

    $scope.someobj = {
      greetings: ["hi", "hello", "welcome"],
      parent: {
          child: "name",
          age: 42
      }
    };

   $scope.open = function () {
      var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'newDBModal.html',
          controller: 'ModalInstanceCtrl',
          size: 'small',
          resolve: {
          }
     });
  }

  $http({
    method: 'GET',
    url: '/listDatabases?databaseName="test"',
  }).then(function successCallback(response) {
     $scope.dbListArray = response.data;
  }, function errorCallback(response) {
      console.log('failure');
  });

  $http({
    method: 'GET',
    url: '/connectToDB?databaseName=syam',
  }).then(function successCallback(response) {
     console.log('connected to syam');
     $http({
       method: 'post',
       url: '/dropDatabase?databaseName=hellow',
     }).then(function successCallback(response) {
        console.log('dropped test2')
     }, function errorCallback(response) {
         console.log('failure');
     });

  }, function errorCallback(response) {
      console.log('failure');
  });


  }
]);
