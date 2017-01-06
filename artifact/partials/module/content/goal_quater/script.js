(function() {
  /** Module */
  var goalquater = angular.module('app.main.module.content.goalquater', ['ui.bootstrap', 'cgBusy']);
  /** Controller */
  goalquater.controller('goalquaterController', [
    '$scope', 'goalquaterService', '$stateParams',
    function($scope, goalquaterService, $stateParams) {
      var vm = this;
    }
  ]);

  /** Service */
  goalquater.factory('goalquaterService', ['$http', 'URL',
    function($http, URL) {
      return {
        "": ""
      }
    }
  ]);

  goalquater.directive('wiservGoalQuater', ['goalquaterService', '$window',
    function(goalquaterService, $window) {
      return {
        restrict: 'ACE',
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          var i = 0;
          var option = {
            tooltip: {},
            legend: {
              left: 'left',
              orient: 'vertical',
              data: ['"五个一批"等重点扶贫工作', '干部驻村帮扶', '"第一书记"教育管理', '巴山迁居工程', '固定资产投资', '重点项目'],
              selected: {
                '"五个一批"等重点扶贫工作': false
              }
            },
            radar: {
              // shape: 'circle',
              name: {
                textStyle: {
                  color: '#333'
                }
              },
              indicator: [{
                name: '巴州区',
                min: 1,
                max: 6
              }, {
                name: '经开区',
                min: 1,
                max: 6
              }, {
                name: '平昌县',
                min: 1,
                max: 6
              }, {
                name: '通江县',
                min: 1,
                max: 6
              }, {
                name: '南江县',
                min: 1,
                max: 6
              }, {
                name: '恩阳区',
                min: 1,
                max: 6
              }],
              axisLabel: {
                show: true,
                formatter: function(data) {
                  i++;
                  if (i <= 6) {
                    return data;
                  }
                }
              }
            },
            series: [{
              name: '预算 vs 开销（Budget vs spending）',
              type: 'radar',
              symbol: 'line',
              data: [{
                  value: [5, 3, 1, 2, 4, 6],
                  name: '固定资产投资'
                }, {
                  value: [4, 6, 5, 3, 1, 2],
                  name: '重点项目'
                }, {
                  value: [],
                  name: '"五个一批"等重点扶贫工作'
                }

              ]
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
