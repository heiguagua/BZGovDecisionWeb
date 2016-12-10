(function() {
  /** Module */
  var profile = angular.module('app.profile', []);
  profile.$inject = ['$location'];
  /** Controller */
  profile.controller('profileController', [
    '$scope', 'profileService',
    function($scope, profileService) {
      var vm = this;
      profileService.getMenus({
        parentId: "0"
      }).then(function(result) {
        vm.menus = result.data;
        if (vm.menus && vm.menus[0] && vm.menus[0].id) {

        }

      });
    }
  ]);

  /** Service */
  profile.factory('profileService', ['$http', 'URL',
    function($http, URL) {
      return {
        getMenus: getMenus
      }

      function getMenus(params) {
        return $http.get(
          URL + '/main/menu', {
            params: params
          }
        )
      }
    }
  ]);

})();
