(function() {
  /** Module */
  var agri = angular.module('app.profile.agri', []);
  agri.$inject = ['$location'];
  /** Controller */
  agri.controller('agriController', [
    '$scope', 'agriService', '$state', '$stateParams', '$window','$rootScope',
    function($scope, agriService, $state, $stateParams, $window,$rootScope) {
      var vm = this;
      $('.profile').css({
        'background': 'url(assets/images/bg.png)'
      });

      $scope.agrilist = [];
      var menuId = $stateParams.proid;
      $rootScope.currentMenu = menuId;
      agriService.getContent({
        menuId: menuId
      }).then(function(result) {
        vm.agricontent = _.sortBy(result.data, ['picCode']);
        _.forEach(vm.agricontent, function(item) {
          var chart = {};
          chart.opened = false;
          chart.url = item.url;
          chart.picCode = item.picCode;
          $scope.agrilist.push(chart);
        });

      });

      // 主要经济指标
      agriService.getagriData({
        picCode: 3003
      }).then(function(result) {
        vm.agriData = result.data;
        $('.datalist').mCustomScrollbar();
      })

    }
  ]);

  /** Service */
  agri.factory('agriService', ['$http', 'URL',
    function($http, URL) {
      return {
        getMenus: getMenus,
        getDetail: getDetail,
        getContent: getContent,
        getDateFormat: getDateFormat,
        getagriData: getagriData
      }

      function getMenus(params) {
        return $http.get(
          URL + '/main/menu', {
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

      function getContent(params) {
        return $http.get(
          URL + '/main/showPics', {
            params: params
          }
        )
      }

      function getDateFormat(parseDate, format) {
        var date = angular.copy(parseDate);
        if (angular.isDate(date) && !isNaN(date.getTime())) {
          return date.Format(format);
        } else {
          return '';
        }
      }

      function getagriData(params) {
        return $http.get(
          URL + '/identity/table', {
            params: params
          }
        )
      }
    }
  ]);

  agri.directive('agriChartRes', ['agriService', '$window',
    function(agriService, $window) {
      return {
        restrict: 'ACE',
        scope: {
          rescontent: '='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          var chartInstance1 = null;
          if (!scope.rescontent || !scope.rescontent.url) {
            return;
          }
          agriService.getDetail(scope.rescontent.url, {
            picCode: scope.rescontent.picCode
          }).then(function(result) {
            var opt = result.data;
            if (!opt || !opt.series) {
              return;
            }
            scope.rescontent.dep_name = opt.dep_name;
            var yAxis_min = 0;
            var yAxis_max = 0;
            if (opt.max_and_min) {
              yAxis_min = Math.round(opt.max_and_min[0].minValue);
              yAxis_max = Math.round(opt.max_and_min[0].maxValue);
            }
            var screen_width = screen.width;
            var grid_top = '24%';
            var grid_left = '8%';
            if (screen_width < 1600) {
              grid_top = '32%';
              grid_left = '10%';
            }

            var colors = ['rgb(0,255,161)', 'rgb(245,225,67)', 'rgb(252,128,20)', 'rgba(0, 120, 215, 0.6)', 'rgba(0, 120, 215, 0.06)','rgb(3,204,215)'];
            opt.yAxis = [];
            _.forEach(opt.y_name, function(item, index) {

              var yAxis = {};
              yAxis.type = 'value';
              yAxis.name = item;
              yAxis.axisTick = {};
              yAxis.axisTick.inside = true;

              if (opt.max_and_min && opt.max_and_min[index]) {
                var minValue = Number(opt.max_and_min[index].minValue);
                var maxValue = Number(opt.max_and_min[index].maxValue);
                if (minValue >= 0 && minValue < 1) {
                  minValue = 0;
                } else {
                  minValue = minValue - 1;
                }
                maxValue = 1 + maxValue;
                yAxis.min = Math.round(minValue);
                yAxis.max = Math.round(maxValue);
              }
              yAxis.splitBumber = 5;
              yAxis.interval = (yAxis.max - yAxis.min) / yAxis.splitBumber;
              yAxis.axisLine = {
                onZero: false,
                lineStyle: {
                  color: colors[3],
                  shadowColor: colors[3],
                  shadowBlur: 4
                }
              };
              yAxis.axisLabel = {};
              yAxis.axisLabel.formatter = function(value) {
                if (((value + '').indexOf('.') != -1)) {
                  return value.toFixed(1);
                }
                return value;
              };
              yAxis.axisLabel.textStyle ={
                color:colors[5]
              };
              yAxis.nameTextStyle = {
                color:colors[5]
              };
              yAxis.splitLine = {
                show: true,
                interval: 'auto',
                lineStyle: {
                  color: colors[3]
                }
              };
              yAxis.splitArea = {
                show: true,
                areaStyle: {
                  color: colors[4]
                }
              };
              opt.yAxis.push(yAxis);
            });
            _.forEach(opt.series,function(item,index){
              item.symbol = 'rect';
              item.symbolSize = 4;
              item.lineStyle = {
                normal:{
                  width:1
                }
              }
              var label_pos = 'top';
              if((index+1)%2 != 0) {
                label_pos = 'bottom';
              }
              item.label = {
                normal:{
                  show:true,
                  position:label_pos
                }
              }
            });

            var option = {
              color: colors,
              tooltip: {
                trigger: 'axis'
              },
              legend: {
                left: 'center',
                top:10,
                data: opt.legend,
                textStyle: {
                  fontSize: 12,
                  color:colors
                },
                itemWidth:15,
                itemHeight:6
              },
              grid: {
                left: grid_left,
                right:grid_left,
                bottom: 30
              },
              xAxis: {
                type: 'category',
                axisTick: {
                  alignWithLabel: false
                },
                data: opt.x_data,
                axisLine: {
                  lineStyle: {
                    color: colors[3],
                    shadowColor: colors[3],
                    shadowBlur: 4
                  }
                },
                axisLabel: {
                  interval: 0,
                  margin:14,
                  textStyle: {
                    fontSize: 10,
                    color:colors[5]
                  }
                },
                splitLine: {
                  show: true,
                  interval: 0,
                  lineStyle: {
                    color: colors[3]
                  }
                },
                splitArea: {
                  show: true,
                  areaStyle: {
                    color: colors[4]
                  }
                }
              },
              yAxis: opt.yAxis,
              series: opt.series
            };

            setTimeout(function() {
              chartInstance1 = echarts.init((element.find('div'))[0]);
              chartInstance1.clear();
              chartInstance1.resize();
              chartInstance1.setOption(option);
            }, 600);

            scope.onResize4 = function() {
              if (chartInstance1) {
                chartInstance1.clear();
                chartInstance1.resize();
                chartInstance1.setOption(option);
              }
            }

            angular.element($window).bind('resize', function() {
              scope.onResize4();
            })
          })
        }
      }
    }
  ]);

  agri.directive('agriChartDistrict', ['agriService', '$window',
    function(agriService, $window) {
      return {
        restrict: 'ACE',
        scope: {
          districtcontent: '='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          var chartInstance2 = null;
          if (!scope.districtcontent || !scope.districtcontent.url) {
            return;
          }
          agriService.getDetail(scope.districtcontent.url, {
            picCode: scope.districtcontent.picCode
          }).then(function(result) {
          var opt = result.data;
          if (!opt || !opt.series) {
            return;
          }
          scope.districtcontent.dep_name = opt.dep_name;

          var colors = ['rgb(0,255,161)', 'rgb(0,168,228)', 'rgba(0, 120, 215, 0.6)', 'rgba(0, 120, 215, 0.06)', 'rgba(0, 255, 161, 0.9)', 'rgb(3,204,215)'];
          var yAxis_min = 0;
          var yAxis_max = 0;
          if (opt.max_and_min) {
            yAxis_min = Math.round(opt.max_and_min[0].minValue);
            yAxis_max = Math.round(opt.max_and_min[0].maxValue);
          }
          opt.yAxis = [];
          _.forEach(opt.y_name, function(item, index) {
            var yAxis = {};
            yAxis.type = 'value';
            yAxis.name = item;
            yAxis.nameTextStyle = {
              color: colors[5]
            };
            yAxis.axisLabel = {
              textStyle: {
                color: colors[5]
              }
            };
            yAxis.axisTick = {};
            yAxis.axisTick.inside = true;
            yAxis.axisLine = {
              lineStyle: {
                color: colors[1],
                shadowColor: colors[1],
                shadowBlur: 4
              }
            };
            yAxis.splitLine = {
              show: true,
              interval: 'auto',
              lineStyle: {
                color: colors[2]
              }
            };
            yAxis.splitArea = {
              show: true,
              areaStyle: {
                color: colors[3]
              }
            };
            if (opt.max_and_min) {
              var minValue = Number(opt.max_and_min[index].minValue);
              var maxValue = Number(opt.max_and_min[index].maxValue);
              if (minValue >= 0 && minValue < 1) {
                minValue = 0;
              } else {
                minValue = minValue - 1;
              }
              maxValue = 1 + maxValue;
              yAxis.min = Math.round(minValue);
              yAxis.max = Math.round(maxValue);
            }
            yAxis.splitBumber = 5;
            yAxis.interval = (yAxis.max - yAxis.min) / yAxis.splitBumber;
            opt.yAxis.push(yAxis);
          });
          _.forEach(opt.series, function(item) {
            if (item.type == 'bar') {
              item.barMaxWidth = '20%';
            }
            if(item.type == 'line') {
              item.connectNulls = true;
            }
            item.label = {
              normal: {
                show: true,
                position: 'top'
              }
            };
          });
          var screen_width = screen.width;
          var grid_top = '24%';
          var grid_left = '10%';
          if (screen_width < 1600) {
            grid_top = '36%';
            grid_left = '12%';
          }

          var option = {
            color: colors,
            tooltip: {
              trigger: 'axis',
              axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
              }
            },

            legend: {
              left: 'center',
              data: opt.legend,
              textStyle: {
                color: '#fbfbfb',
                fontSize: 12
              },
              itemWidth:15,
              itemHeight:6
            },
            grid: {
              // top: grid_top,
              left: grid_left,
              right: '6%',
              bottom: 30
            },
            xAxis: [{
              type: 'category',
              axisTick: {
                alignWithLabel: false
              },
              axisLine: {
                lineStyle: {
                  color: colors[1],
                  shadowColor: colors[1],
                  shadowBlur: 4
                }
              },
              axisLabel: {
                interval: 0,
                margin:14,
                textStyle: {
                  fontSize: 8,
                  color: colors[5]
                },
              },
              splitLine: {
                show: true,
                interval: 0,
                lineStyle: {
                  color: colors[2]
                }
              },
              splitArea: {
                show: true,
                areaStyle: {
                  color: colors[3]
                }
              },
              data: opt.x_data
            }],
            yAxis: opt.yAxis,
            series: opt.series
          };

          setTimeout(function() {
            chartInstance2 = echarts.init((element.find('div'))[0]);
            chartInstance2.clear();
            chartInstance2.resize();
            chartInstance2.setOption(option);
          }, 600);

          scope.onResize2 = function() {
            if (chartInstance2) {
              chartInstance2.clear();
              chartInstance2.resize();
              chartInstance2.setOption(option);
            }
          }

          angular.element($window).bind('resize', function() {
              scope.onResize2();
            })
            })
        }
      }
    }
  ]);

  // 合作社及家庭农场
  agri.directive('agriChartFarm', ['agriService', '$window',
    function(agriService, $window) {
      return {
        restrict: 'ACE',
        scope: {
          farmcontent: '='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          var chartInstance3 = null;
          if (!scope.farmcontent || !scope.farmcontent.url) {
            return;
          }
          agriService.getDetail(scope.farmcontent.url, {
            picCode: scope.farmcontent.picCode
          }).then(function(result) {
          var opt = result.data;
          if (!opt || !opt.series) {
            return;
          }
          scope.farmcontent.dep_name = opt.dep_name;
          var yAxis_min = 0;
          var yAxis_max = 0;
          if (opt.max_and_min) {
            yAxis_min = Math.round(opt.max_and_min[0].minValue);
            yAxis_max = Math.round(opt.max_and_min[0].maxValue);
          }
          var colors = ['rgb(0,255,161)', 'rgb(0,168,228)', 'rgba(0, 120, 215, 0.6)', 'rgba(0, 120, 215, 0.06)', 'rgba(0, 255, 161, 0.9)', 'rgb(3,204,215)'];
          var yAxis_min = 0;
          var yAxis_max = 0;
          if (opt.max_and_min) {
            yAxis_min = Math.round(opt.max_and_min[0].minValue);
            yAxis_max = Math.round(opt.max_and_min[0].maxValue);
          }
          opt.yAxis = [];
          _.forEach(opt.y_name, function(item, index) {
            var yAxis = {};
            yAxis.type = 'value';
            yAxis.name = item;
            yAxis.nameTextStyle = {
              color: colors[5]
            };
            yAxis.axisLabel = {
              textStyle: {
                color: colors[5]
              }
            };
            yAxis.axisTick = {};
            yAxis.axisTick.inside = true;
            yAxis.axisLine = {
              lineStyle: {
                color: colors[1],
                shadowColor: colors[1],
                shadowBlur: 4
              }
            };
            yAxis.splitLine = {
              show: true,
              interval: 'auto',
              lineStyle: {
                color: colors[2]
              }
            };
            yAxis.splitArea = {
              show: true,
              areaStyle: {
                color: colors[3]
              }
            };
            if (opt.max_and_min) {
              var minValue = Number(opt.max_and_min[index].minValue);
              var maxValue = Number(opt.max_and_min[index].maxValue);
              if (minValue >= 0 && minValue < 1) {
                minValue = 0;
              } else {
                minValue = minValue - 1;
              }
              maxValue = 1 + maxValue;
              yAxis.min = Math.round(minValue);
              yAxis.max = Math.round(maxValue);
            }
            yAxis.splitBumber = 5;
            yAxis.interval = (yAxis.max - yAxis.min) / yAxis.splitBumber;
            opt.yAxis.push(yAxis);
          });
          _.forEach(opt.series, function(item) {
            if (item.type == 'bar') {
              item.barMaxWidth = '20%';
            }
            if(item.type == 'line') {
              item.connectNulls = true;
            }
            item.label = {
              normal: {
                show: true,
                position: 'top'
              }
            };
          });
          var screen_width = screen.width;
          var grid_top = '24%';
          var grid_left = '10%';
          if (screen_width < 1600) {
            grid_top = '36%';
            grid_left = '12%';
          }

          var option = {
            color: colors,
            tooltip: {
              trigger: 'axis',
              axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
              }
            },

            legend: {
              left: 'center',
              data: opt.legend,
              textStyle: {
                color: '#fbfbfb',
                fontSize: 12
              },
              itemWidth:15,
              itemHeight:6
            },
            grid: {
              // top: grid_top,
              left: grid_left,
              right: '2%',
              bottom: 30
            },
            xAxis: [{
              type: 'category',
              axisTick: {
                alignWithLabel: false
              },
              axisLine: {
                lineStyle: {
                  color: colors[1],
                  shadowColor: colors[1],
                  shadowBlur: 4
                }
              },
              axisLabel: {
                interval: 0,
                margin:14,
                textStyle: {
                  fontSize: 8,
                  color: colors[5]
                }
              },
              splitLine: {
                show: true,
                interval: 0,
                lineStyle: {
                  color: colors[2]
                }
              },
              splitArea: {
                show: true,
                areaStyle: {
                  color: colors[3]
                }
              },
              data: opt.x_data
            }],
            yAxis: opt.yAxis,
            series: opt.series
          };

          setTimeout(function() {
            chartInstance3 = echarts.init((element.find('div'))[0]);
            chartInstance3.clear();
            chartInstance3.resize();
            chartInstance3.setOption(option);
          }, 600);

          scope.onResize3 = function() {
            if (chartInstance3) {
              chartInstance3.clear();
              chartInstance3.resize();
              chartInstance3.setOption(option);
            }
          }

          angular.element($window).bind('resize', function() {
              scope.onResize3();
            })
            })
        }
      }
    }
  ]);

  // 核桃种植
  agri.directive('agriChartWalnut', ['agriService', '$window',
    function(agriService, $window) {
      return {
        restrict: 'ACE',
        scope: {
          walnutcontent: '='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          var chartInstance4 = null;
          if (!scope.walnutcontent || !scope.walnutcontent.url) {
            return;
          }
          agriService.getDetail(scope.walnutcontent.url, {
            picCode: scope.walnutcontent.picCode
          }).then(function(result) {
          var opt = result.data;
          if (!opt || !opt.series) {
            return;
          }
          scope.walnutcontent.dep_name = opt.dep_name;
          var yAxis_min = 0;
          var yAxis_max = 0;
          if (opt.max_and_min) {
            yAxis_min = Math.round(opt.max_and_min[0].minValue);
            yAxis_max = Math.round(opt.max_and_min[0].maxValue);
          }

          var colors = ['rgb(0,255,161)', 'rgb(0,168,228)', 'rgba(0, 120, 215, 0.6)', 'rgba(0, 120, 215, 0.06)', 'rgba(0, 255, 161, 0.9)', 'rgb(3,204,215)'];
          var yAxis_min = 0;
          var yAxis_max = 0;
          if (opt.max_and_min) {
            yAxis_min = Math.round(opt.max_and_min[0].minValue);
            yAxis_max = Math.round(opt.max_and_min[0].maxValue);
          }
          opt.yAxis = [];
          _.forEach(opt.y_name, function(item, index) {
            var yAxis = {};
            yAxis.type = 'value';
            yAxis.name = item;
            yAxis.nameTextStyle = {
              color: colors[5]
            };
            yAxis.axisLabel = {
              textStyle: {
                color: colors[5]
              }
            };
            yAxis.axisTick = {};
            yAxis.axisTick.inside = true;
            yAxis.axisLine = {
              lineStyle: {
                color: colors[1],
                shadowColor: colors[1],
                shadowBlur: 4
              }
            };
            yAxis.splitLine = {
              show: true,
              interval: 'auto',
              lineStyle: {
                color: colors[2]
              }
            };
            yAxis.splitArea = {
              show: true,
              areaStyle: {
                color: colors[3]
              }
            };
            if (opt.max_and_min) {
              var minValue = Number(opt.max_and_min[index].minValue);
              var maxValue = Number(opt.max_and_min[index].maxValue);
              if (minValue >= 0 && minValue < 1) {
                minValue = 0;
              } else {
                minValue = minValue - 1;
              }
              maxValue = 1 + maxValue;
              yAxis.min = Math.round(minValue);
              yAxis.max = Math.round(maxValue);
            }
            yAxis.splitBumber = 5;
            yAxis.interval = (yAxis.max - yAxis.min) / yAxis.splitBumber;
            opt.yAxis.push(yAxis);
          });
          _.forEach(opt.series, function(item) {
            if (item.type == 'bar') {
              item.barMaxWidth = '20%';
            }
            if(item.type == 'line') {
              item.connectNulls = true;
            }
            item.label = {
              normal: {
                show: true,
                position: 'top'
              }
            };
          });
          var screen_width = screen.width;
          var grid_top = '24%';
          var grid_left = '10%';
          if (screen_width < 1600) {
            grid_top = '36%';
            grid_left = '12%';
          }

          var option = {
            color: colors,
            tooltip: {
              trigger: 'axis',
              axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
              }
            },

            legend: {
              left: 'center',
              data: opt.legend,
              textStyle: {
                color: '#fbfbfb',
                fontSize: 12
              },
              itemWidth:15,
              itemHeight:6
            },
            grid: {
              // top: grid_top,
              left: grid_left,
              right: '2%',
              bottom: 30
            },
            xAxis: [{
              type: 'category',
              axisTick: {
                alignWithLabel: false
              },
              axisLine: {
                lineStyle: {
                  color: colors[1],
                  shadowColor: colors[1],
                  shadowBlur: 4
                }
              },
              axisLabel: {
                interval: 0,
                margin:14,
                textStyle: {
                  fontSize: 8,
                  color: colors[5]
                }
              },
              splitLine: {
                show: true,
                interval: 0,
                lineStyle: {
                  color: colors[2]
                }
              },
              splitArea: {
                show: true,
                areaStyle: {
                  color: colors[3]
                }
              },
              data: opt.x_data
            }],
            yAxis: opt.yAxis,
            series: opt.series
          };

          setTimeout(function() {
            chartInstance4 = echarts.init((element.find('div'))[0]);
            chartInstance4.clear();
            chartInstance4.resize();
            chartInstance4.setOption(option);
          }, 600);

          scope.onResize4 = function() {
            if (chartInstance4) {
              chartInstance4.clear();
              chartInstance4.resize();
              chartInstance4.setOption(option);
            }
          }

          angular.element($window).bind('resize', function() {
              scope.onResize4();
            })
            })
        }
      }
    }
  ]);

  // 农林牧渔业
  agri.directive('agriChartFish', ['agriService', '$window',
    function(agriService, $window) {
      return {
        restrict: 'ACE',
        scope: {
          fishcontent: '='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          var chartInstance5 = null;
          if (!scope.fishcontent || !scope.fishcontent.url) {
            return;
          }
          agriService.getDetail(scope.fishcontent.url, {
            picCode: scope.fishcontent.picCode
          }).then(function(result) {
          var opt = result.data;
          if (!opt || !opt.series) {
            return;
          }
          scope.fishcontent.dep_name = opt.dep_name;
          var yAxis_min = 0;
          var yAxis_max = 0;
          if (opt.max_and_min) {
            yAxis_min = Math.round(opt.max_and_min[0].minValue);
            yAxis_max = Math.round(opt.max_and_min[0].maxValue);
          }
          var colors = ['rgb(0,255,161)', 'rgb(0,168,228)', 'rgba(0, 120, 215, 0.6)', 'rgba(0, 120, 215, 0.06)', 'rgba(0, 255, 161, 0.9)', 'rgb(3,204,215)'];
          var yAxis_min = 0;
          var yAxis_max = 0;
          if (opt.max_and_min) {
            yAxis_min = Math.round(opt.max_and_min[0].minValue);
            yAxis_max = Math.round(opt.max_and_min[0].maxValue);
          }
          opt.yAxis = [];
          _.forEach(opt.y_name, function(item, index) {
            var yAxis = {};
            yAxis.type = 'value';
            yAxis.name = item;
            yAxis.nameTextStyle = {
              color: colors[5]
            };
            yAxis.axisLabel = {
              textStyle: {
                color: colors[5]
              }
            };
            yAxis.axisTick = {};
            yAxis.axisTick.inside = true;
            yAxis.axisLine = {
              lineStyle: {
                color: colors[1],
                shadowColor: colors[1],
                shadowBlur: 4
              }
            };
            yAxis.splitLine = {
              show: true,
              interval: 'auto',
              lineStyle: {
                color: colors[2]
              }
            };
            yAxis.splitArea = {
              show: true,
              areaStyle: {
                color: colors[3]
              }
            };
            if (opt.max_and_min) {
              var minValue = Number(opt.max_and_min[index].minValue);
              var maxValue = Number(opt.max_and_min[index].maxValue);
              if (minValue >= 0 && minValue < 1) {
                minValue = 0;
              } else {
                minValue = minValue - 1;
              }
              maxValue = 1 + maxValue;
              yAxis.min = Math.round(minValue);
              yAxis.max = Math.round(maxValue);
            }
            yAxis.splitBumber = 5;
            yAxis.interval = (yAxis.max - yAxis.min) / yAxis.splitBumber;
            opt.yAxis.push(yAxis);
          });
          _.forEach(opt.series, function(item) {
            if (item.type == 'bar') {
              item.barMaxWidth = '20%';
            }
            if(item.type == 'line') {
              item.connectNulls = true;
            }
            item.label = {
              normal: {
                show: true,
                position: 'top'
              }
            };
          });
          var screen_width = screen.width;
          var grid_top = '24%';
          var grid_left = '10%';
          if (screen_width < 1600) {
            grid_top = '36%';
            grid_left = '12%';
          }

          var option = {
            color: colors,
            tooltip: {
              trigger: 'axis',
              axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
              }
            },

            legend: {
              left: 'center',
              data: opt.legend,
              textStyle: {
                color: '#fbfbfb',
                fontSize: 12
              },
              itemWidth:15,
              itemHeight:6
            },
            grid: {
              // top: grid_top,
              left: grid_left,
              right: '2%',
              bottom: 30
            },
            xAxis: [{
              type: 'category',
              axisTick: {
                alignWithLabel: false
              },
              axisLine: {
                lineStyle: {
                  color: colors[1],
                  shadowColor: colors[1],
                  shadowBlur: 4
                }
              },
              axisLabel: {
                interval: 0,
                margin:14,
                textStyle: {
                  fontSize: 8,
                  color: colors[5]
                }
              },
              splitLine: {
                show: true,
                interval: 0,
                lineStyle: {
                  color: colors[2]
                }
              },
              splitArea: {
                show: true,
                areaStyle: {
                  color: colors[3]
                }
              },
              data: opt.x_data
            }],
            yAxis: opt.yAxis,
            series: opt.series
          };

          setTimeout(function() {
            chartInstance5 = echarts.init((element.find('div'))[0]);
            chartInstance5.clear();
            chartInstance5.resize();
            chartInstance5.setOption(option);
          }, 600);

          scope.onResize5 = function() {
            if (chartInstance5) {
              chartInstance5.clear();
              chartInstance5.resize();
              chartInstance5.setOption(option);
            }
          }

          angular.element($window).bind('resize', function() {
              scope.onResize5();
            })
            })
        }
      }
    }
  ]);

})();
