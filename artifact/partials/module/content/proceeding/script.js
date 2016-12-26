(function() {
  /** Module */
  var proceeding = angular.module('app.main.module.content.proceeding', ['ui.bootstrap','cgBusy']);
  /** Controller */
  proceeding.controller('proceedingController', [
    '$scope', 'proceedingService', '$stateParams',
    function($scope, proceedingService, $stateParams) {
      var vm = this;
    }
  ]);

  /** Service */
  proceeding.factory('proceedingService', ['$http', 'URL',
    function($http, URL) {
      return {
        "": ""
      }
    }
  ]);

})();
