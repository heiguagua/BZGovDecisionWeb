(function() {
  /** Module */
  var module = angular.module('app.main.module', []);
  /** Controller */
  module.controller('moduleController', [
    '$scope', 'moduleService','$stateParams','$state',
    function($scope, moduleService,$stateParams,$state) {
      var vm = this;

      moduleService.getMenuTabs({parentId:$stateParams.id}).then(function(result){
        vm.menuTabs = (result && result.data) ? result.data.body : "";
        $state.go('main.module.content',{tid:vm.menuTabs[0].id});
      })

    }
  ]);

  /** Service */
  module.factory('moduleService', ['$http', 'URL',
    function($http, URL) {
      return {
        getMenuTabs: getMenuTabs
      }
      function getMenuTabs(params){
        return $http.get(
          URL + '/main/menu', {
            params: params
          }
        )
      }

    }
  ]);

})();
