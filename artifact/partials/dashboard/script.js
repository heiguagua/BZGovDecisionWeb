(function() {
  /** Module */
  var dashboard = angular.module('app.dashboard', []);
  dashboard.$inject = ['$location'];
  /** Controller */
  dashboard.controller('dashboardController', [
    '$scope', 'dashboardService',
    function($scope, dashboardService) {
      var vm = this;
    }
  ]);

  /** Service */
  dashboard.factory('dashboardService', ['$http', 'URL',
    function($http, URL) {
      return {
        getDashboardData: getDashboardData
      }

      function getDashboardData() {
        return $http.get(
          URL + '/dashboard/data'
        )
      }
    }]);

})();
