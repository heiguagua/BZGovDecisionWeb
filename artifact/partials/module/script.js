(function() {
  /** Module */
  var module = angular.module('app.main.module', []);
  /** Controller */
  module.controller('moduleController', [
    '$scope', 'moduleService', '$stateParams', '$state',
    function($scope, moduleService, $stateParams, $state) {
      var vm = this;
      if ($stateParams.url != '') {
        // $state.go('main.module.file', { // hide file for temporary
        //   furl: $stateParams.url
        // });
      } else {
        moduleService.getMenuTabs({
          parentId: $stateParams.id
        }).then(function(result) {
          vm.menuTabs = result.data;
          if(vm.menuTabs && vm.menuTabs[0] && vm.menuTabs[0].id) {
            $scope.current_menu = vm.menuTabs[0].name;
            $state.go('main.module.content', {
              tid: vm.menuTabs[0].id
            });
          }
        })
      }

      vm.toggleSecMenus = function(ev){
        ev.stopPropagation();
        $('.menu-label').toggleClass('m-collapse');
      }

    }
  ]);

  /** Service */
  module.factory('moduleService', ['$http', 'URL',
    function($http, URL) {
      return {
        getMenuTabs: getMenuTabs
      }

      function getMenuTabs(params) {
        return $http.get(
          URL + '/main/menu', {
            params: params
          }
        )
      }



    }
  ]);

})();
