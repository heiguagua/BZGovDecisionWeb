(function() {
  /** Module */
  var proceeding = angular.module('app.main.module.content.proceeding', ['ui.bootstrap', 'cgBusy']);
  /** Controller */
  proceeding.controller('proceedingController', [
    '$scope', 'proceedingService', '$stateParams',
    function($scope, proceedingService, $stateParams) {
      var vm = this;
      proceedingService.getContent({
        menuId: $stateParams.pid
      }).then(function(result) {
        $scope.alldatas = result.data;
        _.forEach(result.data, function(item) {
          var url = item.url + '/' + item.picCode;

          proceedingService.getContentDatas(url).then(function(res) {
            if (item.picCode == 'businessSupervisionByMonth') {
              $scope.bsMonth = res.data;
              _.forEach($scope.bsMonth.data, function(data) {
                switch (data.indicator_name) {
                  case '本月新增督办事项':
                    $scope.bs_increased = Number(data.item_number);
                    break;
                  case '本月继续督办事项':
                    $scope.bs_going = Number(data.item_number);
                    break;
                  case '历史逾期未办结事项':
                    $scope.bs_history = Number(data.item_number);
                    break;
                  case '本月应办结事项':
                    $scope.should_do = Number(data.item_number);
                    break;
                  case '本月应办结事项办结数':
                    $scope.done_num = Number(data.item_number);
                    break;
                  case '历史逾期事项本月办结数':
                    $scope.done_history = Number(data.item_number);
                    break;
                  case '本月逾期未办结事项数':
                    $scope.delay_num = Number(data.item_number);
                    break;
                  case '历史逾期事项本月未办结':
                    $scope.delay_history = Number(data.item_number);
                    break;
                }
              })
            }
            if (item.picCode == 'businessSupervisionQuarterly') {
              $scope.quarter_data = res.data;
              _.forEach($scope.quarter_data, function(data) {
                if (data.quarter == 1) {
                  data.quarter = '一';
                }
                if (data.quarter == 2) {
                  data.quarter = '二';
                }
                if (data.quarter == 3) {
                  data.quarter = '三';
                }
                if (data.quarter == 4) {
                  data.quarter = '四';
                }
              })
            }
            if (item.picCode == 'businessSupervisionYearly') {
              $scope.yearData = res.data;
            }
          })
        })
      })
    }
  ]);

  /** Service */
  proceeding.factory('proceedingService', ['$http', 'URL',
    function($http, URL) {
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

  proceeding.directive('wiservTargetProcnum', ['proceedingService',
    function(proceedingService) {
      return {
        restrict: 'ACE',
        scope: {
          numdata: '='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          var data_nums = [];
          _.forEach(scope.numdata.value,function(data) {
            if(data.name == '本月新增督办事项' || data.name == '本月继续督办事项' || data.name == '历史逾期未办结事项') {
              data.type = 'bar';
              data.barMaxWidth = '50%';
              data.stack = '纳入本月';
              data_nums.push(data);
            }
          });
          var option = {
            title: {
              text: '纳入各月督办事项数目',
              subtext: '数据来源：市委目督办',
              left: 'center',
              top: '4%'
            },
            color: ['rgb(49,167,229)', 'rgb(40,200,202)'],
            tooltip: {
              trigger: 'axis',
              axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            legend: {
              data: _.map(data_nums,'name'),
              top: '19%',
              // itemGap: 10,
              itemWidth:16,
              itemHeight:16,
              borderWidth:0
              // orient:'vertical',
              // left:'right'
            },
            grid: {
              top: '34%',
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: [{
              type: 'category',
              axisLabel:{
                interval:0,
              },
              data: scope.numdata.month
            }],
            yAxis: [{
              type: 'value',
              name: '%'
            }],
            series: data_nums
          };

          setTimeout(function() {
            var chartInstance = echarts.init((element.find('div'))[0]);
            chartInstance.clear();
            chartInstance.resize();
            chartInstance.setOption(option);
          }, 300);
        }
      }
    }
  ]);

  proceeding.directive('wiservTargetProcrate', ['proceedingService',
    function(proceedingService) {
      return {
        restrict: 'ACE',
        scope: {
          ratedata: '='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          var dataValue = [];
          _.forEach(scope.ratedata.value,function(data){
            if(data.name == '纳入各月督办事项办结率') {
              dataValue = data.data;
            }
          })
          var option = {
            title: {
              text: '纳入各月督办事项办结率',
              subtext: '数据来源：市委目督办',
              left: 'center',
              top: '4%'
            },
            color: ['rgb(49,167,229)', 'rgb(40,200,202)'],
            tooltip: {
              trigger: 'axis',
              axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            legend: {
              data: ['办结率'],
              top: '19%',
              itemGap: 50
            },
            grid: {
              top: '34%',
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: [{
              type: 'category',
              axisLabel:{
                interval:0,
              },
              data: scope.ratedata.month
            }],
            yAxis: [{
              type: 'value',
              name: '%'
            }],
            series: [{
              name: '办结率',
              type: 'line',
              data: dataValue,
              label: {
                normal: {
                  show: true
                }
              },
            }]
          };

          setTimeout(function() {
            var chartInstance = echarts.init((element.find('div'))[0]);
            chartInstance.clear();
            chartInstance.resize();
            chartInstance.setOption(option);
          }, 300);
        }
      }
    }
  ]);

})();
