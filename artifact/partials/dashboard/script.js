(function() {
  /** Module */
  var dashboard = angular.module('app.dashboard', []);
  dashboard.$inject = ['$location'];
  /** Controller */
  dashboard.controller('dashboardController', [
    '$scope', 'dashboardService',
    function($scope, dashboardService) {
      var vm = this;
      dashboardService.getMenus({parentId:"0"}).then(function(result) {
        vm.menus = (result && result.data) ? result.data.body : "";
      });
    }
  ]);

  /** Service */
  dashboard.factory('dashboardService', ['$http', 'URL',
    function($http, URL) {
      return {
        getMenus: getMenus
      }

      function getMenus(params) {
        return $http.get(
          URL + '/main/menu',{
            params: params
          }
        )
      }
    }]);

})();
