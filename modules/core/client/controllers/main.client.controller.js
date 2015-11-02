'use strict';
angular.module('core').controller('ModalInstanceCtrl', function ($scope, $modalInstance) {
  $scope.ok = function () {
  $modalInstance.close();
};

$scope.cancel = function () {
  $modalInstance.dismiss('cancel');
};
});
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

    //     $http({
    //       method: 'GET',
    //       url: '/listDatabases',
    //     }).then(function successCallback(response) {
    //        console.log(JSON.stringify(response));
    // }, function errorCallback(response) {
    //   // called asynchronously if an error occurs
    //   // or server returns response with an error status.
    //   console.log('failure');
    // });
}
  }
]);
