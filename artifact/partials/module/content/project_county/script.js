(function() {
  /** Module */
  var projectcounty = angular.module('app.main.module.content.projectcounty', ['ui.bootstrap','cgBusy']);
  /** Controller */
  projectcounty.controller('projectcountyController', [
    '$scope', 'projectcountyService', '$stateParams',
    function($scope, projectcountyService, $stateParams) {
      var vm = this;
    }
  ]);

  /** Service */
  projectcounty.factory('projectcountyService', ['$http', 'URL',
    function($http, URL) {
      return {
        "": ""
      }
    }
  ]);

})();
