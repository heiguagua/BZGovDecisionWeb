(function() {
  /** Module */
  var goalprogress = angular.module('app.main.module.content.goalprogress', ['ui.bootstrap', 'cgBusy']);
  /** Controller */
  goalprogress.controller('goalprogressController', [
    '$scope', 'goalprogressService', '$stateParams', 'uibDateParser',
    function($scope, goalprogressService, $stateParams, uibDateParser) {
      var vm = this;

      $scope.quarterOptions = [{
        'id': 3,
        "name": "第一季度"
      }, {
        'id': 6,
        "name": "第二季度"
      }, {
        'id': 9,
        "name": "第三季度"
      }, {
        'id': 12,
        "name": "第四季度"
      }];
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
        if (!$scope.datepick.quarter) {
          alert('请选择季度！');
          return;
        }
      }
      $scope.altInputFormats = ['M!/d!/yyyy'];
    }
  ]);

  /** Service */
  goalprogress.factory('goalprogressService', ['$http', 'URL',
    function($http, URL) {
      return {
        '': ''
      }
    }
  ]);

  goalprogress.directive('wiservGoalProgress', ['goalprogressService', '$window',
    function(goalprogressService, $window) {
      return {
        restrict: 'ACE',
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          var option = {
            title: {
              text: '全市目标任务进度',
              // subtext: '数据来源：市委目督办',
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

  goalprogress.directive('wiservGoalRate', ['goalprogressService', '$window',
    function(goalprogressService, $window) {
      return {
        restrict: 'ACE',
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          var option = {
            title: {
              text: '2016年全市目标工作正常推进率',
              // subtext: '数据来源：市委目督办',
              left: 'center',
              top: '4%'
            },
            color: ['rgb(49,167,229)', 'rgb(40,200,202)', 'rgb(221,129,142)'],
            tooltip: {
              trigger: 'axis',
              axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            legend: {
              data: ['第一季度', '第二季度', '第三季度'],
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
              data: ['县、区', '经开区', '市委部门', '市政府部门', '驻巴单位', '驻外办事机构']
            }],
            yAxis: [{
              type: 'value',
              name: '%'
            }],
            series: [{
              name: '第一季度',
              type: 'line',
              data: [16, 19, 20, 21, 24, 23],
              label: {
                normal: {
                  show: true
                }
              },
            }, {
              name: '第二季度',
              type: 'line',
              data: [18, 26, 22, 30, 23, 33],
              label: {
                normal: {
                  show: true
                }
              }
            }, {
              name: '第三季度',
              type: 'line',
              data: [21, 23, 26, 29, 26, 30],
              label: {
                normal: {
                  show: true
                }
              }
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
