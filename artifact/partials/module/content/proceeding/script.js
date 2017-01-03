(function() {
  /** Module */
  var proceeding = angular.module('app.main.module.content.proceeding', ['ui.bootstrap', 'cgBusy']);
  /** Controller */
  proceeding.controller('proceedingController', [
    '$scope', 'proceedingService', '$stateParams',
    function($scope, proceedingService, $stateParams) {
      var vm = this;
    }
  ]);

  /** Service */
  proceeding.factory('proceedingService', ['$http', 'URL',
    function($http, URL) {
      return {
        "": ""
      }
    }
  ]);

  proceeding.directive('wiservTargetProcnum', ['proceedingService',
    function(proceedingService) {
      return {
        restrict: 'ACE',
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
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
              data: ['进度正常', '进度滞后'],
              top: '17%',
              itemGap: 50
            },
            grid: {
              top: '26%',
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: [{
              type: 'category',
              data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
            }],
            yAxis: [{
              type: 'value',
              name: '%'
            }],
            series: [{
              name: '进度正常',
              type: 'bar',
              barMaxWidth: '50%',
              stack: '纳入本月',
              data: [40, 32, 30, 14, 24, 23, 11, 15, 24, 29],
              label: {
                normal: {
                  show: true
                }
              },
            }, {
              name: '进度滞后',
              type: 'bar',
              barMaxWidth: '50%',
              stack: '纳入本月',
              data: [22, 18, 19, 23, 19, 23, 20, 17, 14, 18],
              label: {
                normal: {
                  show: true
                }
              },
            } ]
          };

          setTimeout(function(){
            var chartInstance = echarts.init((element.find('div'))[0]);
            chartInstance.clear();
            chartInstance.resize();
            chartInstance.setOption(option);
          },300);
        }
      }
    }
  ]);

  proceeding.directive('wiservTargetProcrate', ['proceedingService',
    function(proceedingService) {
      return {
        restrict: 'ACE',
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
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
              top: '17%',
              itemGap: 50
            },
            grid: {
              top: '26%',
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: [{
              type: 'category',
              data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
            }],
            yAxis: [{
              type: 'value',
              name: '%'
            }],
            series: [{
              name: '办结率',
              type: 'line',
              data: [40, 32, 30, 14, 24, 23, 11, 15, 24, 29],
              label: {
                normal: {
                  show: true
                }
              },
            }]
          };

          setTimeout(function(){
            var chartInstance = echarts.init((element.find('div'))[0]);
            chartInstance.clear();
            chartInstance.resize();
            chartInstance.setOption(option);
          },300);
        }
      }
    }
  ]);

})();
