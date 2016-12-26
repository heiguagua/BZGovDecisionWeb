(function() {
  /** Module */
  var job = angular.module('app.main.module.content.job', ['ui.bootstrap','cgBusy']);
  /** Controller */
  job.controller('jobController', [
    '$scope', 'jobService', '$stateParams', 'uibDateParser',
    function($scope, jobService, $stateParams, uibDateParser) {
      var vm = this;
      $scope.popups = [];
      $scope.quarterOptions = [{
        'id': 3,
        "name": "第一季度"
      }, {
        'id': 6,
        "name": "第二季度"
      }, {
        'id': 9,
        "name": "第三季度"
      }];
      $scope.promiseMain = jobService.getContent({
        menuId: $stateParams.pid
      }).then(function(result) {
        //1
        vm.dcontent = _.sortBy(result.data, ['picCode']);
        console.log(vm.dcontent);
        vm.dcontent[0]['opened'] = false;
        vm.dcontent[0]['model'] = new Date();
        vm.dcontent[0]['quarter'] = $scope.quarterOptions[1];
        $scope.year = new Date(vm.dcontent[0].model).getFullYear();
        $scope.content = vm.dcontent[0];
      })
      $scope.open = function(index) {
        vm.dcontent[0].opened = true;
      };

      $scope.changed = function(index) {
        if (!angular.isDate(vm.dcontent[0].model) || isNaN(vm.dcontent[0].model.getTime())) {
          return;
        }
        //获取当前选择的年份
        $scope.year = new Date(vm.dcontent[0].model).getFullYear();
      }
      $scope.altInputFormats = ['M!/d!/yyyy'];
    }
  ]);

  /** Service */
  job.factory('jobService', ['$http', 'URL',
    function($http, URL) {
      return {
        getContent: getContent,
        getDetail: getDetail,
        getTableData: getTableData
      }

      function getContent(params) {
        return $http.get(
          URL + '/main/showPics', {
            params: params
          }
        )
      }

      function getDetail(detailUrl, params) {
        return $http.get(
          URL + detailUrl, {
            params: params
          }
        )
      }

      function getTableData(tableUrl, params) {
        return $http.get(
          URL + tableUrl, {
            params: params
          }
        )
      }
    }
  ]);

  job.directive('eChart', ['jobService','$window',
    function(jobService,$window) {
      return {
        restrict: 'ACE',
        scope: {
          content: '='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link:function(scope,element,attrs){
          scope.$watch('content.model', function(newValue, oldValue, scope) {
            if(newValue == oldValue){
              return;
            }
            drawData();
          });
          drawData()
          function drawData(){
            var dateYear,dateMoth;
            if(scope.content && scope.content.model){
                  dateYear = new Date(scope.content.model).getFullYear();
                  dateMoth = new Date(scope.content.model).getMonth();
              scope.date = dateYear +'-'+dateMoth;
            }else{
                dateYear = new Date().getFullYear();
                dateMoth = new Date().getMonth() + 1;
                dateDay = new Date().getDay();
                scope.date = dateYear +'-'+ dateMoth;
               scope.content = {};
               scope.content['model'] = new Date();
               scope.content['url'] = '/main/job';
               scope.content['picCode'] = '1';
            }
          scope.content.promise = jobService.getDetail(scope.content.url, {
            queryTime: scope.date,
            picCode: scope.content.picCode
          }).then(function(result) {
            var options = result.data.chartData;
            var toolTip = {
              trigger: 'axis',
              axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
              },
              formatter: function(params) {
                return params[0].name + '<br/>' + params[0].seriesName + ' : ' + params[0].value + '<br/>' + params[1].seriesName + ' : ' + params[1].value;
              }
            };
            options['tooltip'] = toolTip;
            chartInstance = echarts.init((element.find('div'))[0]);
            element.find('div')[0].style.height = '250px';
            chartInstance.clear();
            chartInstance.resize();
            chartInstance.setOption(options);
          })
          }
        }
      }
    }
  ]);


})();
