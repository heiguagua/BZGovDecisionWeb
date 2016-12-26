(function() {
  /** Module */
  var ecocity = angular.module('app.main.module.content.ecocity', ['ui.bootstrap','cgBusy']);
  /** Controller */
  ecocity.controller('ecocityController', [
    '$scope', 'ecocityService', '$stateParams',
    function($scope, ecocityService, $stateParams) {
      var vm = this;
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
