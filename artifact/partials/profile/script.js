(function() {
  /** Module */
  var profile = angular.module('app.profile', []);
  profile.$inject = ['$location'];
  /** Controller */
  profile.controller('profileController', [
    '$scope', 'profileService', '$state', '$stateParams', '$rootScope',
    function($scope, profileService, $state, $stateParams, $rootScope) {
      var vm = this;
      $rootScope.showMenu = true;
      profileService.getMenus({
        parentId: "0"
      }).then(function(result) {
        vm.menus = result.data;
        vm.cMenu = vm.menus[1];
        $rootScope.currentMenu = vm.cMenu.id;
        _.forEach(vm.menus, function(item) {
          var mname = item.name;
          switch (mname) {
            case '首页':
              item.profile_sref = 'profile.index';
              break;
            case '经济概况':
              item.profile_sref = 'profile.menu';
              break;
            case '经济详情':
              item.profile_sref = 'profile.eco';
              break;
            case '经济形势分析':
              item.profile_sref = 'profile.spot';
              break;
            case '工业管理':
              item.profile_sref = 'profile.industry';
              break;
            case '农业管理':
              item.profile_sref = 'profile.agri';
              break;
            case '服务业管理':
              item.profile_sref = 'profile.service';
              break;
            case '旅游业管理':
              item.profile_sref = 'profile.travel';
              break;
            default:
              break;
          }
        });
        _.remove(vm.menus, function(item) {
          return item.name == '精准扶贫' || item.name == '目标工作分析';
        })
        if (vm.menus && vm.menus[0] && vm.menus[0].id) {
          $('.profile').css({
            'background': 'url(assets/images/bg_profile.png)'
          });
          $state.go('profile.index', {
            proid: vm.menus[0].id
          });
          // if()
          // if($stateParams.proid == 8) {
          //   $state.go('profile.menu');
          // }
          // else{
          //   $state.go('profile.eco');
          // }
        }

      });

      vm.currentMenu = function(menu) {
        if (menu.type == '3') { //经济概况
          vm.cMenu = vm.menus[1];
        } else {
          vm.cMenu = menu;
        }

      }

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
