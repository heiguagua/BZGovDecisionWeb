(function() {
  /** Module */
  var content = angular.module('app.main.module.content', []);
  /** Controller */
  content.controller('contentController', [
    '$scope', 'contentService','$stateParams','$state',
    function($scope, contentService,$stateParams,$state) {
      var vm = this;
      contentService.getSubMenus({parentId:$stateParams.tid}).then(function(result){
        vm.subMenus = result.data;
        $state.go('main.module.content.detail',{pid:vm.subMenus[0].id});
      })
    }
  ]);

  /** Service */
  content.factory('contentService', ['$http', 'URL',
    function($http, URL) {
      return {
        getSubMenus: getSubMenus
      }
      function getSubMenus(params){
        return $http.get(
          URL + '/main/menu', {
            params: params
          }
        )
      }
    }
  ]);

})();
