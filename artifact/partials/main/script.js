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
        _.forEach(vm.menus,function(item,index) {
          console.log(item);
          if(item && item.type == 3) { // 经济概况
            vm.menus.splice(index, 1);
          }
        })
        if($stateParams.typeid == 3) { // 首页
          //$state.go('main.preview',{preid:$stateParams.mid});
        }
        // else if($stateParams.typeid == 2) { // 政策文件
        //   $state.go('main.file',{furl:$stateParams.murl});
        // }
        else{
          $state.go('main.module',{id:$stateParams.mid});
        }
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
