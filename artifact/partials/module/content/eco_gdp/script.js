(function() {
  /** Module */
  var ecogdp = angular.module('app.main.module.content.ecogdp', ['ui.bootstrap','cgBusy']);
  /** Controller */
  ecogdp.controller('ecogdpController', [
    '$scope', 'ecogdpService', '$stateParams',
    function($scope, ecogdpService, $stateParams) {
      var vm = this;
    }
  ]);

  /** Service */
  ecogdp.factory('ecogdpService', ['$http', 'URL',
    function($http, URL) {
      return {
        "": ""
      }
    }
  ]);

})();
