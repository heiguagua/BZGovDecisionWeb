(function() {
  /** Module */
  var content = angular.module('app.main.module.content', []);
  /** Controller */
  content.controller('contentController', [
    '$scope', 'contentService', '$stateParams', '$state',
    function($scope, contentService, $stateParams, $state) {
      var vm = this;
      contentService.getSubMenus({
        parentId: $stateParams.tid
      }).then(function(result) {
        vm.subMenus = result.data;
        if (vm.subMenus && vm.subMenus[0] && vm.subMenus[0].id) {
          $('.side-nav').removeClass('sidebar-collapse');
          $('.m-header').removeClass('sidebar-collapse');
          $('.mobile-content').removeClass('sidebar-collapse');
          $state.go('main.module.content.detail', {
            pid: vm.subMenus[0].id,
            mname: vm.subMenus[0].name
          });
        }
      })
    }
  ]);

  /** Service */
  content.factory('contentService', ['$http', 'URL',
    function($http, URL) {
      return {
        getSubMenus: getSubMenus
      }

      function getSubMenus(params) {
        return $http.get(
          URL + '/main/menu', {
            params: params
          }
        )
      }
    }
  ]);

})();
