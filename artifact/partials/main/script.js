(function() {
  /** Module */
  var main = angular.module('app.main', []);
  /** Controller */
  main.controller('mainController', [
    '$scope', 'mainService','$state',
    function($scope, mainService,$state) {
      var vm = this;
      // get menu list
      mainService.getMenus({parentId:"0"}).then(function(result) {
        vm.menus = (result && result.data) ? result.data.body : "";
        $state.go('main.module',{id:vm.menus[0].id});
      });
    }
  ]);

  /** Service */
  main.factory('mainService', ['$http', 'URL',
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
    }
  ]);

})();
