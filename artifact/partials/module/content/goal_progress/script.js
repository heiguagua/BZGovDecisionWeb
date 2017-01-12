(function() {
  /** Module */
  var goalprogress = angular.module('app.main.module.content.goalprogress', ['ui.bootstrap', 'cgBusy']);
  /** Controller */
  goalprogress.controller('goalprogressController', [
    '$scope', 'goalprogressService', '$stateParams', 'uibDateParser', '$rootScope',
    function($scope, goalprogressService, $stateParams, uibDateParser, $rootScope) {
      var vm = this;

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
          alert('请输入正确的日期格式！');
          return;
        }
        if (!$scope.datepick.quarter) {
          alert('请选择季度！');
          return;
        }
      }
      $scope.altInputFormats = ['M!/d!/yyyy'];

      goalprogressService.getContent({
        menuId: $stateParams.pid
      }).then(function(result) {
        $scope.alldatas = result.data;
        _.forEach(result.data, function(item) {
          var url = item.url + '/' + item.picCode;

          goalprogressService.getContentDatas(url).then(function(res) {
            if (item.picCode == 'cityYearlyTargetSchedule') {
              $scope.cityQuarterData = res.data;
            }
            if (item.picCode == 'cityQuarterlyTargetSchedule') {
              $scope.cityYearData = res.data;
              $scope.cityYearData.url = url;
              $scope.datepick.model = new Date($scope.cityYearData.year);
              $scope.datepick.quarter = Number($scope.cityYearData.quarter);
            }
          })
        })
      })
    }
  ]);

  /** Service */
  goalprogress.factory('goalprogressService', ['$http', 'URL',
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

      function getContentDatas(url, params) {
        return $http.get(
          URL + url, {
            params: params
          }
        )
      }
    }
  ]);

  goalprogress.directive('wiservGoalProgress', ['goalprogressService', '$window',
    function(goalprogressService, $window) {
      return {
        restrict: 'ACE',
        scope: {
          yearlydata: '=',
          datemodel: '='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          scope.$watch('datemodel.model', function(newValue, oldValue) {
            if (newValue === oldValue || !newValue || !oldValue) {
              return;
            }
            getData();
          },true);

          scope.$watch('datemodel.quarter', function(newValue, oldValue) {
            if (newValue === oldValue || !newValue || !oldValue) {
              return;
            }
            getData();
          },true);

          function getDateFormat(parseDate, format) {
            var date = angular.copy(parseDate);
            if (angular.isDate(date) && !isNaN(date.getTime())) {
              return date.Format(format);
            } else {
              return '';
            }
          }

          function getData() {
            goalprogressService.getContentDatas(scope.yearlydata.url, {
              year: getDateFormat(scope.datemodel.model, 'yyyy'),
              quarter: scope.datemodel.quarter
            }).then(function(res) {
              var url = scope.yearlydata.url;
              scope.yearlydata = res.data;
              scope.yearlydata.url = url;
              scope.datemodel.quarter = Number(scope.datemodel.quarter);
              redraw();
            })
          }

          redraw();

          function redraw() {
            if (scope.yearlydata) {
              var normalData = [];
              var delayData = [];
              scope.datemodel.quarter = Number(scope.datemodel.quarter);
              _.forEach(scope.yearlydata.data.value, function(item) {
                if (item.name == 'nomal') {
                  normalData = item.data;
                }
                if (item.name == 'delay') {
                  delayData = item.data;
                }
              });
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
                  data: scope.yearlydata.data.area
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
                  data: normalData,
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
                  data: delayData,
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
      }
    }
  ]);

  goalprogress.directive('wiservGoalRate', ['goalprogressService', '$window',
    function(goalprogressService, $window) {
      return {
        restrict: 'ACE',
        scope: {
          quarterlydata: '='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          if (scope.quarterlydata) {
            var dataList = [];
            _.forEach(scope.quarterlydata.value, function(item) {
              if (item.quarter == 1) {
                item.name = '第一季度';
              }
              if (item.quarter == 2) {
                item.name = '第二季度';
              }
              if (item.quarter == 3) {
                item.name = '第三季度';
              }
              if (item.quarter == 4) {
                item.name = '第四季度';
              }
              item.type = 'line';
              item.label = {
                normal: {
                  show: true
                }
              };
            })
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
                data: _.map(scope.quarterlydata.value, 'name'),
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
                data: scope.quarterlydata.area
              }],
              yAxis: [{
                type: 'value',
                name: '%'
              }],
              series: scope.quarterlydata.value
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
    }
  ]);


})();
