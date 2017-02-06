(function () {
  /** Module */
  var ecocity = angular.module('app.main.module.content.ecocity', ['ui.bootstrap', 'cgBusy']);
  /** Controller */
  ecocity.controller('ecocityController', [
    '$scope', 'ecocityService', '$stateParams','$rootScope',
    function ($scope, ecocityService, $stateParams,$rootScope) {
      var vm = this;
      $rootScope.mname = $stateParams.mname;
      setTimeout(function() {
        $('.menu-label').removeClass('m-collapse');
      }, 600);
      ecocityService.getContent({
        menuId: $stateParams.pid
      }).then(function (result) {
        var data = result.data[0];
        console.log(data);
        var picCode = data.picCode;
        var url = data.url;
        url = url + '/' + picCode;
        console.log(url);
        ecocityService.getContentDatas(url).then(function (res) {
          console.log(res);
          var data = res.data;
          $scope.indicatorDatas = data.data;
          angular.forEach(data.data, function (data, index, array) {
            if (data.indicator_name == '地区生产总值') {
              $scope.indicatorFirst = data;
            }
          });
          $('.eco_footer').mCustomScrollbar();
        })
      })
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
