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
  function ($scope, http, location, $uibModal) {

$scope.open = function () {
    var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'newDBModal.html',
          controller: 'ModalInstanceCtrl',
          size: 'small',
          resolve: {
          }
        });
      }
  }
]);
