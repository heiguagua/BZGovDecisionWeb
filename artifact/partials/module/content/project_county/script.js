(function () {
  /** Module */
  var projectcounty = angular.module('app.main.module.content.projectcounty', ['ui.bootstrap', 'cgBusy']);
  /** Controller */
  projectcounty.controller('projectcountyController', [
    '$scope', 'projectcountyService', '$stateParams',
    function ($scope, projectcountyService, $stateParams) {
      var vm = this;
      $scope.popups = [];
      $scope.quarterOptions = [{
        'id': 1,
        "name": "第一季度"
      }, {
        'id': 2,
        "name": "第二季度"
      }, {
        'id': 3,
        "name": "第三季度"
      }, {
        'id': 4,
        "name": "第四季度"
      }];
      //  时间插件
      $scope.datepick = {};
      $scope.datepick.format = 'yyyy';
      // $scope.datepick.model = new Date();
      $scope.datepick.dateOptions = {};
      $scope.datepick.dateOptions.minMode = 'year';
      $scope.datepick.dateOptions.datepickerMode = 'year';

      $scope.open = function () {
        $scope.datepick.opened = true;
      };

      $scope.changed = function () {
        if (!angular.isDate($scope.datepick.model) || isNaN($scope.datepick.model.getTime())) {
          alert('请输入正确的日期格式！');

          return;
        }
        if (!$scope.datepick.quarter) {
          alert('请选择季度！');
          return;
        }
      }
      $scope.altInputFormats = ['M!/d!/yyyy'];

      projectcountyService.getContent({
        menuId: $stateParams.pid
      }).then(function (result) {

        _.forEach(result.data, function (item) {
          var url = item.url + '/' + item.picCode;

          projectcountyService.getContentDatas(url).then(function (res) {
            if (item.picCode == 'countyScheduleIndicatorsSummary') {
              // $scope.allCityData = res.data.data;
              // $scope.url1=url;
            }
            if (item.picCode == 'countyScheduleIndicators') {
              $scope.url2=url;
              var data = res.data;
              $scope.indicatorDatas = data.data;
              $scope.datepick.model = new Date(data.year);
              $scope.datepick.quarter = Number(data.quarter);
               var summary_index = data.summary_index
              $scope.allCityData = data.data[summary_index - 1];
               $('.eco_footer').mCustomScrollbar();
            }
          })
        })
      })

      $scope.$watch('datepick.model', function (newValue, oldValue) {
        if (newValue === oldValue || !newValue || !oldValue) {
          return;
        }
        getData();
      }, true);

      $scope.$watch('datepick.quarter', function (newValue, oldValue) {
        console.log(newValue);
        console.log(oldValue);
        if (newValue === oldValue || !newValue || !oldValue) {
          return;
        }
        getData();
      }, true);
      // 格式化数据
      function getDateFormat(parseDate, format) {
        var date = angular.copy(parseDate);
        if (angular.isDate(date) && !isNaN(date.getTime())) {
          return date.Format(format);
        } else {
          return '';
        }
      }
      function getData() {
        console.log($scope.url);
        projectcountyService.getContentDatasUrl($scope.url2, {
          year: getDateFormat($scope.datepick.model, 'yyyy'),
          quarter: $scope.datepick.quarter
        }).then(function (res) {
          var summary_index = data.summary_index
          $scope.indicatorDatas = data.data;
          $scope.allCityData = data.data[summary_index - 1];
          console.log($scope.allCityData)
         
        })
        // projectcountyService.getContentDatasUrl($scope.url1, {
        //   year: getDateFormat($scope.datepick.model, 'yyyy'),
        //   quarter: $scope.datepick.quarter
        // }).then(function (res) {
        //   var data = res.data;
        
        //   $scope.allCityData = data.data;
        // })
      }
      Date.prototype.Format = function (fmt) { //author: meizz
        var o = {
          "M+": this.getMonth() + 1, //月份
          "d+": this.getDate(), //日
          "h+": this.getHours(), //小时
          "m+": this.getMinutes(), //分
          "s+": this.getSeconds(), //秒
          "q+": Math.floor((this.getMonth() + 3) / 3), //季度
          "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt))
          fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
          if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
      }
    }
  ]);

  /** Service */
  projectcounty.factory('projectcountyService', ['$http', 'URL',
    function ($http, URL) {
      return {
        "getContent": getContent,
        "getContentDatas": getContentDatas,
        "getContentDatasUrl": getContentDatasUrl
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
      function getContentDatasUrl(url, params) {
        return $http.get(
          URL + url, {
            params: params
          }
        )
      }

    }
  ]);

})();
