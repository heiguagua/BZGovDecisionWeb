(function () {
  /** Module */
  var ecogdp = angular.module('app.main.module.content.ecogdp', ['ui.bootstrap', 'cgBusy']);
  /** Controller */
  ecogdp.controller('ecogdpController', [
    '$scope', 'ecogdpService', '$stateParams','$rootScope',
    function ($scope, ecogdpService, $stateParams,$rootScope) {
      var vm = this;
      $rootScope.mname = $stateParams.mname;
      setTimeout(function() {
        $('.menu-label').removeClass('m-collapse');
      }, 600);
      ecogdpService.getContent({
        menuId: $stateParams.pid
      }).then(function (result) {
        var data = result.data[0];
        console.log(data);
        var picCode = data.picCode;
        var url = data.url;
        url = url + '/' + picCode;
        console.log(url);
        console.log(1111);
        ecogdpService.getContentDatas(url).then(function (res) {
          console.log(res);
          var data = res.data;
          $scope.indicatorDatas = data;
          console.log($scope.indicatorDatas);

          $('.eco_gdp').mCustomScrollbar();
        })
      })
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
