(function() {
  /** Module */
  var main = angular.module('app.main', []);
  /** Controller */
  main.controller('mainController', [
    '$scope', 'mainService','$state','$stateParams',
    function($scope, mainService,$state,$stateParams) {
      var vm = this;
      vm.showMenu = function() {
        $('.side-nav').toggleClass('sidebar-collapse');
        $('.m-header').toggleClass('sidebar-collapse');
        $('.main-content').toggleClass('sidebar-collapse');
      }
      // get menu list
      mainService.getMenus({parentId:"0"}).then(function(result) {
        vm.menus = result.data;
        _.remove(vm.menus,function(item){
          return item.type == '2' || item.type == '3';
        });
        $state.go('main.module',{id:$stateParams.mid});
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
