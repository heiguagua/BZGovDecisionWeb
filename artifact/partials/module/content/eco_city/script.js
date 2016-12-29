(function() {
  /** Module */
  var ecocity = angular.module('app.main.module.content.ecocity', ['ui.bootstrap','cgBusy']);
  /** Controller */
  ecocity.controller('ecocityController', [
    '$scope', 'ecocityService', '$stateParams',
    function($scope, ecocityService, $stateParams) {
      var vm = this;
      // 分页
      $scope.maxSize = 5;
           $scope.totalItems = 12;
          $scope.currentPage = 1;
    }
  ]);

  /** Service */
  ecocity.factory('ecocityService', ['$http', 'URL',
    function($http, URL) {
      return {
        "": ""
      }
    }
  ]);

})();
