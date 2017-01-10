(function() {
  /** Module */
  var goalyear = angular.module('app.main.module.content.goalyear', ['ui.bootstrap', 'cgBusy']);
  /** Controller */
  goalyear.controller('goalyearController', [
    '$scope', 'goalyearService', '$stateParams',
    function($scope, goalyearService, $stateParams) {
      var vm = this;
      $scope.datepick = {};
      $scope.datepick.format = 'yyyy';
      $scope.datepick.model = new Date();
      $scope.datepick.dateOptions = {};
      $scope.datepick.dateOptions.minMode = 'year';
      $scope.datepick.dateOptions.datepickerMode = 'year';

      $scope.open = function() {
        $scope.datepick.opened = true;
      };

      $scope.changed = function() {
        if (!angular.isDate($scope.datepick.model) || isNaN($scope.datepick.model.getTime())) {
          //alert('请输入正确的日期格式！');
          return;
        }

      }

      goalyearService.getContent({
        menuId:$stateParams.pid
      }).then(function(result){
        var data = result.data[0];
        var picCode = data.picCode;
        var url = data.url;
        url = url + '/' + picCode;
         goalyearService.getContentDatas(url).then(function(res){
           $scope.indicatorDatas = res.data;
           _.forEach($scope.indicatorDatas,function(item){
             if(item.area == 'county') {
               $scope.countyDatas = item.data;
             }
             if(item.area == 'party') {
               $scope.partyDatas = item.data;
             }
             if(item.area == 'gov') {
               $scope.govDatas = item.data;
             }
             if(item.area == 'center') {
               $scope.centerDatas = item.data;
             }
             if(item.area == 'foreign') {
               $scope.foreignDatas = item.data;
             }
           })
         })
      })
    }
  ]);

  /** Service */
  goalyear.factory('goalyearService', ['$http', 'URL',
    function($http, URL) {
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
