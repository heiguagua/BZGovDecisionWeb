(function() {
  /** Module */
  var goalyear = angular.module('app.main.module.content.goalyear', ['ui.bootstrap','cgBusy']);
  /** Controller */
  goalyear.controller('goalyearController', [
    '$scope', 'goalyearService', '$stateParams',
    function($scope, goalyearService, $stateParams) {
      var vm = this;
    }
  ]);

  /** Service */
  goalyear.factory('goalyearService', ['$http', 'URL',
    function($http, URL) {
      return {
        "": ""
      }
    }
  ]);

})();
