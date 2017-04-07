(function() {
  /** Module */
  var auth = angular.module('app.auth', []);
  auth.$inject = ['$location'];
  /** Controller */
  auth.controller('authController', [
    '$scope', 'authService','$state',
    function($scope, authService,$state) {
      var vm = this;
      $scope.chartlist = [];

      authService.getMenus().then(function(result) {
        vm.menus = result.data;
        if (vm.menus && vm.menus[0] && vm.menus[0].id) {
          $state.go('profile',{location: 'replace'});
        }
      });

    }
  ]);

  /** Service */
  auth.factory('authService', ['$http', 'URL',
    function($http, URL) {
      return {
        getMenus: getMenus
      }

      function getMenus(params) {
        return $http.get(
          URL + '/auth', {
            params: params
          }
        )
      }
    }
  ]);


})();
