(function () {
  /** Module */
  var ecocity = angular.module('app.main.module.content.ecocity', ['ui.bootstrap', 'cgBusy']);
  /** Controller */
  ecocity.controller('ecocityController', [
    '$scope', 'ecocityService', '$stateParams','$rootScope','$sce',
    function ($scope, ecocityService, $stateParams,$rootScope,$sce) {
      var vm = this;
      $rootScope.mname = $stateParams.mname;
      setTimeout(function() {
        $('.menu-label').removeClass('m-collapse');
      }, 600);
      ecocityService.getContent({
        menuId: $stateParams.pid
      }).then(function (result) {
        var data = result.data[0];
        var picCode = data.picCode;
        var url = data.url;
        url = url + '/' + picCode;
        ecocityService.getContentDatas(url).then(function (res) {
          var data = res.data;
          $scope.indicatorDatas = data.data;
          angular.forEach(data.data, function (data, index, array) {
            if (data.indicator_name == '地区生产总值') {
              $scope.indicatorFirst = data;
            }
          });
          var screen_width = screen.width;
          if(screen_width > 1200) {
            $('.eco_footer').mCustomScrollbar();
          }
        })
      });

      

    }
  ]);

  /** Service */
  ecocity.factory('ecocityService', ['$http', 'URL',
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
