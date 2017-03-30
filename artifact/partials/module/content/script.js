(function() {
  /** Module */
  var content = angular.module('app.main.module.content', []);
  /** Controller */
  content.controller('contentController', [
    '$scope', 'contentService', '$stateParams', '$state','$rootScope',
    function($scope, contentService, $stateParams, $state,$rootScope) {
      var vm = this;
      $rootScope.smname = $stateParams.smname;
      contentService.getSubMenus({
        parentId: $stateParams.tid
      }).then(function(result) {
        vm.subMenus = result.data;
        if (vm.subMenus && vm.subMenus[0] && vm.subMenus[0].id) {
          $('.side-nav').removeClass('sidebar-collapse');
          $('.m-header').removeClass('sidebar-collapse');
          $('.mobile-content').removeClass('sidebar-collapse');
          if (vm.subMenus[0].type == '4') {
            vm.flag = true;
            _.forEach(vm.subMenus, function(item) {
              var mname = item.name;
              switch (mname) {
                case '目标任务进度分析':
                  item.content_sref = 'main.module.content.goalprogress';
                  break;
                case '季度考核结果分析':
                  item.content_sref = 'main.module.content.goalquater';
                  break;
                case '年度考核结果分析':
                  item.content_sref = 'main.module.content.goalyear';
                  break;
                case '事项督办':
                  item.content_sref = 'main.module.content.proceeding';
                  break;
                case '全市主要经济指标进度':
                  item.content_sref = 'main.module.content.ecocity';
                  break;
                case '县区主要经济指标进度':
                  item.content_sref = 'main.module.content.ecocounty';
                  break;
                case '全市GDP支撑指标进度':
                  item.content_sref = 'main.module.content.ecogdp';
                  break;
                case '全市进度':
                  item.content_sref = 'main.module.content.projectcity';
                  break;
                case '区县进度':
                  item.content_sref = 'main.module.content.projectcounty';
                  break;
                default:
                  break;
              }
            });
            $state.go(vm.subMenus[0].content_sref, {
              pid: vm.subMenus[0].id,
              mname: vm.subMenus[0].name
            });

          } else {
            $state.go('main.module.content.detail', {
              pid: vm.subMenus[0].id,
              mname: vm.subMenus[0].name
            });
            vm.flag = false;
          }

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
