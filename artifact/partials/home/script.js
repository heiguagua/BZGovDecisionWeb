(function() {
  /** Module */
  var home = angular.module('app.home', ['cgBusy']);
  home.$inject = ['$location'];
  /** Controller */
  home.controller('homeController', [
    '$scope', 'homeService','$state',
    function($scope, homeService,$state) {
      var vm = this;
      vm.promise = homeService.getMenus({parentId:"0"}).then(function(result) {
        vm.menus = result.data;
        _.remove(vm.menus, function(item) {
            return item.name == '首页' || item.name == '经济概况' || item.name == '精准扶贫' || item.name == '经济形势分析';
        });
        // _.remove(vm.menus,function(item){
        //   return item.type == '2' || item.type == '3';
        // });
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
