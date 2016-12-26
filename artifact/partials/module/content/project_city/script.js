(function() {
  /** Module */
  var projectcity = angular.module('app.main.module.content.projectcity', ['ui.bootstrap','cgBusy']);
  /** Controller */
  projectcity.controller('projectcityController', [
    '$scope', 'projectcityService', '$stateParams',
    function($scope, projectcityService, $stateParams) {
      var vm = this;
    }
  ]);

  /** Service */
  projectcity.factory('projectcityService', ['$http', 'URL',
    function($http, URL) {
      return {
        "": ""
      }
    }
  ]);

})();
