(function() {
  /** Module */
  var goalquater = angular.module('app.main.module.content.goalquater', ['ui.bootstrap', 'cgBusy']);
  /** Controller */
  goalquater.controller('goalquaterController', [
    '$scope', 'goalquaterService', '$stateParams', '$rootScope',
    function($scope, goalquaterService, $stateParams, $rootScope) {
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
          //alert('请输入正确的日期格式！');
          return;
        }
        if (!$scope.targetExamRanks.quarter) {
          alert('请选择季度！');
          return;
        }
      }
      $scope.altInputFormats = ['M!/d!/yyyy'];

      goalquaterService.getContent({
        menuId: $stateParams.pid
      }).then(function(result) {
        $scope.alldatas = result.data;
        _.forEach(result.data, function(item) {
          var url = item.url + '/' + item.picCode;

          goalquaterService.getContentDatas(url).then(function(res) {
            if (item.picCode == 'targetExamTotalRanks') {
              $scope.targetExamTotalRanks = res.data;
            }
            if (item.picCode == 'targetExamRanks') {
              $scope.targetExamRanks = res.data;
              $scope.targetExamRanks.url = url;
              $scope.datepick.model = new Date($scope.targetExamRanks.year);
            }
            if (item.picCode == 'penalUnits') {
              $scope.penalUnits = res.data;
              $scope.penlTotal = 0;
              _.forEach($scope.penalUnits.data, function(data) {
                $scope.penlTotal += Number(data.penal_points);
              })
            }
            if (item.picCode == 'awardedUnits') {
              $scope.awardedUnits = res.data;
              $scope.awardedTotal = 0;
              _.forEach($scope.awardedUnits.data, function(data) {
                $scope.awardedTotal += Number(data.awarded_points);
              })
            }
          })
        })
      })

    }
  ]);

  /** Service */
  goalquater.factory('goalquaterService', ['$http', 'URL',
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

  goalquater.directive('wiservGoalQuater', ['goalquaterService', '$window',
    function(goalquaterService, $window) {
      return {
        restrict: 'ACE',
        scope: {
          quaterdata: '=',
          datemodel: '='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {

          scope.$watch('datemodel.model', function(newValue, oldValue) {
            if (newValue === oldValue || !newValue || !oldValue) {
              return;
            }
            getData();
          });

          scope.$watch('quaterdata.quarter', function(newValue, oldValue) {
            if (newValue === oldValue || !newValue || !oldValue) {
              return;
            }
            getData();
          });

          function getDateFormat(parseDate, format) {
            var date = angular.copy(parseDate);
            if (angular.isDate(date) && !isNaN(date.getTime())) {
              return date.Format(format);
            } else {
              return '';
            }
          }

          function getData() {
            goalquaterService.getContentDatas(scope.quaterdata.url, {
              year: getDateFormat(scope.datemodel.model, 'yyyy'),
              quarter: scope.quaterdata.quarter
            }).then(function(res) {
              var url = scope.quaterdata.url;
              scope.quaterdata = res.data;
              scope.quaterdata.url = url;
              scope.quaterdata.quarter = Number(scope.quaterdata.quarter);
              redraw();
            })
          }

          redraw();

          function redraw() {
            if (scope.quaterdata && scope.quaterdata.area) {
              var areas = scope.quaterdata.area;
              var areaList = [];
              _.forEach(areas, function(item) {
                var obj = {};
                obj.name = item;
                obj.min = 1;
                obj.max = areas.length;
                areaList.push(obj);
              })
              var chartData = scope.quaterdata.data;
              var legend = _.map(chartData, 'name');
              scope.quaterdata.quarter = Number(scope.quaterdata.quarter);
              var i = 0;
              var option = {
                title: {
                  left: 'center',
                  text: scope.quaterdata.year + '年第' + scope.quaterdata.quarter + '季度 目标任务考核分项名次',
                  top: -2
                },
                tooltip: {},
                legend: {
                  left: 'left',
                  top: '10%',
                  orient: 'vertical',
                  data: legend,
                  itemGap: 4
                },

                radar: {
                  // shape: 'circle',
                  center: ['60%', '54%'],
                  name: {
                    textStyle: {
                      color: '#333'
                    }
                  },
                  radius: '65%',
                  nameGap: 8,
                  indicator: areaList,
                  axisLabel: {
                    show: false,
                    formatter: function(data) {
                      i++;
                      if (i <= 6) {
                        return data;
                      }
                    }
                  }
                },
                series: [{
                  name: '目标任务考核',
                  type: 'radar',
                  symbol: 'line',
                  data: chartData
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


})();
