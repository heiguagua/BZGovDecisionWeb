(function() {
  /** Module */
  var goalquater = angular.module('app.main.module.content.goalquater', ['ui.bootstrap','cgBusy']);
  /** Controller */
  goalquater.controller('goalquaterController', [
    '$scope', 'goalquaterService', '$stateParams',
    function($scope, goalquaterService, $stateParams) {
      var vm = this;
    }
  ]);

  /** Service */
  goalquater.factory('goalquaterService', ['$http', 'URL',
    function($http, URL) {
      return {
        "": ""
      }
    }
  ]);

})();
