(function() {
  /** Module */
  var ecocounty = angular.module('app.main.module.content.ecocounty', ['ui.bootstrap','cgBusy']);
  /** Controller */
  ecocounty.controller('ecocountyController', [
    '$scope', 'ecocountyService', '$stateParams',
    function($scope, ecocountyService, $stateParams) {
      var vm = this;
    }
  ]);

  /** Service */
  ecocounty.factory('ecocountyService', ['$http', 'URL',
    function($http, URL) {
      return {
        "": ""
      }
    }
  ]);

})();
