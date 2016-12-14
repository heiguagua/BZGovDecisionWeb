(function() {
  /** Module */
  var profile = angular.module('app.profile', []);
  profile.$inject = ['$location'];
  /** Controller */
  profile.controller('profileController', [
    '$scope', 'profileService', '$state', '$stateParams',
    function($scope, profileService, $state, $stateParams) {
      var vm = this;
      profileService.getMenus({
        parentId: "0"
      }).then(function(result) {
        vm.menus = result.data;
        _.forEach(vm.menus ,function(item) {
          var mname = item.name;
          switch (mname) {
            case '经济概况':
              item.profile_sref = 'profile.menu';
              break;
            case '经济形势分析':
              item.profile_sref = 'profile.eco';
              break;
            case '工业管理':
              item.profile_sref = 'profile.industry';
              break;
            default:
              break;
          }
        })
        if (vm.menus && vm.menus[0] && vm.menus[0].id) {
          $('.profile').css({
            'background': 'url(assets/images/bg_profile.png)'
          });
          $state.go('profile.menu');
          // if()
          // if($stateParams.proid == 8) {
          //   $state.go('profile.menu');
          // }
          // else{
          //   $state.go('profile.eco');
          // }
        }

      });

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
