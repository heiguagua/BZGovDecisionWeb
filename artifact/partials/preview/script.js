(function() {
  /** preview */
  var preview = angular.module('app.main.preview', []);
  /** Controller */
  preview.controller('previewController', [
    '$scope', 'previewService', '$stateParams', '$state',
    function($scope, previewService, $stateParams, $state) {
      var vm = this;


    }
  ]);

  /** Service */
  preview.factory('previewService', ['$http', 'URL',
    function($http, URL) {
      return {
        getMenuTabs: getMenuTabs
      }

      function getMenuTabs(params) {
        return $http.get(
          URL + '/main/menu', {
            params: params
          }
        )
      }



    }
  ]);

})();
