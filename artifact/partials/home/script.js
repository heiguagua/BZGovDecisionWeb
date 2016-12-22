(function() {
  /** Module */
  var home = angular.module('app.home', []);
  home.$inject = ['$location'];
  /** Controller */
  home.controller('homeController', [
    '$scope', 'homeService','$state',
    function($scope, homeService,$state) {
      var vm = this;
      homeService.getMenus({parentId:"0"}).then(function(result) {
        vm.menus = result.data;
        _.remove(vm.menus,function(item){
          return item.type == '2' || item.type == '3';
        });
      });

    }
  ]);

  /** Service */
  home.factory('homeService', ['$http', 'URL',
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