(function () {
  /** Module */
  var ecogdp = angular.module('app.main.module.content.ecogdp', ['ui.bootstrap', 'cgBusy']);
  /** Controller */
  ecogdp.controller('ecogdpController', [
    '$scope', 'ecogdpService', '$stateParams','$rootScope','$sce',
    function ($scope, ecogdpService, $stateParams,$rootScope,$sce) {
      var vm = this;
      $rootScope.mname = $stateParams.mname;
      setTimeout(function() {
        $('.menu-label').removeClass('m-collapse');
      }, 600);
      ecogdpService.getContent({
        menuId: $stateParams.pid
      }).then(function (result) {
        var data = result.data[0];
        var picCode = data.picCode;
        var url = data.url;
        url = url + '/' + picCode;
        ecogdpService.getContentDatas(url).then(function (res) {
          var data = res.data;
          $scope.indicatorDatas = data;
          var screen_width = screen.width;
          if(screen_width > 1200) {
            $('.eco_gdp').mCustomScrollbar();
          }
        })
      });

      $scope.trusted = {};
      $scope.detailInfo = function(s) {
        var html = '<p>'+s.indicator_name+'</p><div>目标总量：'+s.yearly_target+'</div>'+'<div>完成总量：'+s.current_quarter_achieved+'</div>'
        +'<div>目标增速：'+s.yearly_target_growth+'%</div>'
        +'<div>实际增速：'+s.current_quarter_actual_growth+'%</div>'
        +'<div>增速状态：'+s.growth_status+'%</div>'
        +'<div>增速评价：'+s.schedule_evaluation+'</div>';
        return $scope.trusted[html] || ($scope.trusted[html] = $sce.trustAsHtml(html));
        }
    }
  ]);

  /** Service */
  ecogdp.factory('ecogdpService', ['$http', 'URL',
    function ($http, URL) {
      return {
        "getContent": getContent,
        "getContentDatas": getContentDatas
      }
      function getContent(params) {
        return $http.get(
          URL + '/main/showPics', {
            params: params
          }
        )
      }
      function getContentDatas(params) {
        return $http.get(
          URL + params
        )
      }
    }
  ]);

})();
