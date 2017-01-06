(function () {
  /** Module */
  var ecocity = angular.module('app.main.module.content.ecocity', ['ui.bootstrap', 'cgBusy']);
  /** Controller */
  ecocity.controller('ecocityController', [
    '$scope', 'ecocityService', '$stateParams',
    function ($scope, ecocityService, $stateParams) {
      var vm = this;
      ecocityService.getContent({
        menuId:$stateParams.pid
      }).then(function(result){
        var data = result.data[0];
        console.log(data);
        var picCode = data.picCode;
        var url = data.url;
        url = url + '/' + picCode;
        console.log(url);
         ecocityService.getContentDatas(url).then(function(res){
           console.log(res);
           var data=res.data;
           $scope.indicatorDatas=data.data;
           $scope.indicatorFirst=data.data[0];
         })
      })
      //$scope.indicatorData.growth_statu=$scope.indicatorData.growth_statu<0?'差'+Math.abs($scope.indicatorData.growth_statu):'超'+Math.abs($scope.indicatorData.growth_statu);
     
    }
  ]);

  /** Service */
  ecocity.factory('ecocityService', ['$http', 'URL',
    function ($http, URL) {
      return {
        "getContent": getContent,
        "getContentDatas":getContentDatas
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
