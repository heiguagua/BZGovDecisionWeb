(function() {
  /** Module */
  var travel = angular.module('app.profile.travel', []);
  travel.$inject = ['$location'];
  /** Controller */
  travel.controller('travelController', [
    '$scope', 'travelService', '$state', '$stateParams', '$window','$rootScope',
    function($scope, travelService, $state, $stateParams, $window,$rootScope) {
      var vm = this;
      $rootScope.showMenu = true;
      $('.profile').css({
        'background': 'url(assets/images/bg.png)'
      });

      $scope.travellist = [];
      var menuId = $stateParams.proid;
      $rootScope.currentMenu = menuId;
      travelService.getContent({
        menuId: menuId
      }).then(function(result) {
        vm.travelcontent = _.sortBy(result.data, ['picCode']);
        _.forEach(vm.travelcontent, function(item) {
          var chart = {};
          chart.opened = false;
          chart.url = item.url;
          chart.picCode = item.picCode;
          $scope.travellist.push(chart);
        });

      });

      // 主要经济指标
      travelService.gettravelData({
        picCode: 5003
      }).then(function(result) {
        vm.travelData = result.data;
        $('.datalist').mCustomScrollbar();
      })

    }
  ]);

  /** travel */
  travel.factory('travelService', ['$http', 'URL',
    function($http, URL) {
      return {
        getMenus: getMenus,
        getDetail: getDetail,
        getContent: getContent,
        getDateFormat: getDateFormat,
        gettravelData: gettravelData
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

      function gettravelData(params) {
        return $http.get(
          URL + '/identity/table', {
            params: params
          }
        )
      }
    }
  ]);

  travel.directive('travelChartHouse', ['agriService', '$window',
    function(agriService, $window) {
      return {
        restrict: 'ACE',
        scope: {
          housecontent: '='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          var chartInstance1 = null;
          if (!scope.housecontent || !scope.housecontent.url) {
            return;
          }
          agriService.getDetail(scope.housecontent.url, {
            picCode: scope.housecontent.picCode
          }).then(function(result) {
            var opt = result.data;
            if (!opt || !opt.series) {
              return;
            }
            scope.housecontent.dep_name = opt.dep_name;
            var yAxis_min = 0;
            var yAxis_max = 0;
            if (opt.max_and_min) {
              yAxis_min = Math.round(opt.max_and_min[0].minValue);
              yAxis_max = Math.round(opt.max_and_min[0].maxValue);
            }
            var screen_width = screen.width;
            var grid_top = '24%';
            var grid_left = '10%';
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
                    fontSize: 12,
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

  // A级景区
  travel.directive('travelChartSite', ['agriService', '$window',
    function(agriService, $window) {
      return {
        restrict: 'ACE',
        scope: {
          sitecontent: '='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          var chartInstance1 = null;
          if (!scope.sitecontent || !scope.sitecontent.url) {
            return;
          }
          agriService.getDetail(scope.sitecontent.url, {
            queryTime: agriService.getDateFormat(scope.sitecontent.model, scope.sitecontent.format),
            picCode: scope.sitecontent.picCode
          }).then(function(result) {
            var opt = result.data;
            if (!opt || !opt.series) {
              return;
            }
            if (!scope.sitecontent.model && opt.init_query_time != '') {
              scope.sitecontent.model = new Date(opt.init_query_time);
            }
            scope.sitecontent.query_time = opt.init_query_time;
            scope.sitecontent.dep_name = opt.dep_name;
            var dateOptions = {};
            dateOptions.formatYear = 'yyyy';
            if (opt.time_scope == 'year') {
              scope.econtent.format = 'yyyy';
              dateOptions.minMode = 'year';
              dateOptions.datepickerMode = 'year';
            }
            if (opt.time_scope == 'month') {
              scope.sitecontent.format = 'yyyy-MM';
              dateOptions.minMode = 'month';
              dateOptions.datepickerMode = 'month';
            }
            scope.sitecontent.dateOptions = dateOptions;

            _.forEach(opt.series[1].data, function(data) {

            });


            var colors = ['rgb(0,204,200)', 'rgb(240,119,129)', 'rgb(0,168,228)'];
            var option = {
              color: colors,
              tooltip: {
                trigger: 'item',
                formatter: function(obj) {
                  var percentShow = '';

                  var labelShow = obj.data.name + '<br/>';
                  if (obj.data.other && obj.data.other.length > 1) {
                    for (var i = 0; i < obj.data.other.length; i++) {
                      labelShow += obj.data.other[i].name + ":" + obj.data.other[i].value + obj.data.other[i].unit + '<br/>';
                    }
                  } else {
                    labelShow = obj.data.name + ":" + obj.data.value + opt.y_name[0] + '<br/>';
                    if (opt.auto_count && opt.auto_count == 'percent') {
                      labelShow += '占比：' + obj.percent + '%';
                    }
                  }
                  return labelShow;
                }
              },
              series: [{
                name: opt.series[0].name,
                type: 'pie',
                selectedMode: 'single',
                radius: [0, '25%'],

                label: {
                  normal: {
                    position: 'center',
                    formatter: function(obj) {
                      return obj.data.name + '\n' + obj.data.value + opt.y_name[0];
                    },
                    //formatter: '{b}\n {c}亿元',
                    textStyle: {
                      color: '#FFF',
                      fontSize: 14
                    }
                  }
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                itemStyle: {
                  normal: {
                    color: 'rgba(255,255,255,0)'
                  }
                },
                data: opt.series[0].data
              }, {
                name: opt.series[1].name,
                type: 'pie',
                label: {
                  normal: {
                    formatter: function(obj) {
                      var percentShow = '';

                      var labelShow = '\n' + obj.data.name + '\n\n';
                      if (obj.data.other && obj.data.other.length > 1) {
                        for (var i = 0; i < obj.data.other.length; i++) {
                          if (i == obj.data.other.length - 1) {
                            labelShow += obj.data.other[i].name + ":" + obj.data.other[i].value + obj.data.other[i].unit;
                          } else {
                            labelShow += obj.data.other[i].name + ":" + obj.data.other[i].value + obj.data.other[i].unit + '\n\n';
                          }
                        }
                      } else {
                        labelShow = obj.data.name + ":" + obj.data.value + '\n\n';
                        if (opt.auto_count && opt.auto_count == 'percent') {
                          labelShow += '占比：' + obj.percent + '%';
                        }
                      }
                      return labelShow;
                    },
                    textStyle: {
                      color: '#FFF',
                      fontSize: 14
                    }
                  }
                },
                radius: ['25%', '50%'],
                data: opt.series[1].data
              }]
            };
            // set labelLine style
            var screen_width = screen.width;
            if (screen_width < 1600) {
              option.series[1].startAngle = 130;
              option.series[1].labelLine = {
                normal: {
                  length: 14,
                  length2: 8
                }
              };
              option.series[0].label.normal.textStyle = {
                color: '#FFF',
                fontSize: 10
              };
              option.series[1].label.normal.textStyle = {
                color: '#FFF',
                fontSize: 10
              };
            }

            //chartInstance1 = echarts.init((element.find('div'))[0]);
            //  chartInstance1.setOption(option);
            setTimeout(function() {
              chartInstance1 = echarts.init((element.find('div'))[0]);
              //element.find('div')[0].style.height = $('.graph').height() + 'px';
              chartInstance1.clear();
              chartInstance1.resize();
              chartInstance1.setOption(option);
            }, 600);

            scope.onResize1 = function() {
              if (chartInstance1) {
                chartInstance1.clear();
                chartInstance1.resize();
                chartInstance1.setOption(option);
              }
            }

            angular.element($window).bind('resize', function() {
              scope.onResize1();
            })
          })
        }
      }
    }
  ]);

  // 星级饭店
  travel.directive('travelChartResta', ['agriService', '$window',
    function(agriService, $window) {
      return {
        restrict: 'ACE',
        scope: {
          restacontent: '='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          var chartInstance1 = null;
          if (!scope.restacontent || !scope.restacontent.url) {
            return;
          }
          agriService.getDetail(scope.restacontent.url, {
            picCode: scope.restacontent.picCode
          }).then(function(result) {
            var opt = result.data;
            if (!opt || !opt.series) {
              return;
            }
            scope.restacontent.dep_name = opt.dep_name;
            var yAxis_min = 0;
            var yAxis_max = 0;
            if (opt.max_and_min) {
              yAxis_min = Math.round(opt.max_and_min[0].minValue);
              yAxis_max = Math.round(opt.max_and_min[0].maxValue);
            }
            var screen_width = screen.width;
            var grid_top = '24%';
            var grid_left = '10%';
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
                    fontSize: 12,
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

  // 旅行社
  travel.directive('travelChartTour', ['agriService', '$window',
    function(agriService, $window) {
      return {
        restrict: 'ACE',
        scope: {
          tourcontent: '='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          var chartInstance1 = null;
          if (!scope.tourcontent || !scope.tourcontent.url) {
            return;
          }
          agriService.getDetail(scope.tourcontent.url, {
            picCode: scope.tourcontent.picCode
          }).then(function(result) {
            var opt = result.data;
            if (!opt || !opt.series) {
              return;
            }
            scope.tourcontent.dep_name = opt.dep_name;
            var yAxis_min = 0;
            var yAxis_max = 0;
            if (opt.max_and_min) {
              yAxis_min = Math.round(opt.max_and_min[0].minValue);
              yAxis_max = Math.round(opt.max_and_min[0].maxValue);
            }
            var screen_width = screen.width;
            var grid_top = '24%';
            var grid_left = '10%';
            if (screen_width < 1600) {
              grid_top = '32%';
              grid_left = '10%';
            }
            _.forEach(opt.series, function(item, index) {
              item.symbol = 'rect';
              item.symbolSize = 4;
              item.lineStyle = {
                normal: {
                  width: 1
                }
              }
              var label_pos = 'top';
              if ((index + 1) % 2 != 0) {
                label_pos = 'bottom';
              }
              item.label = {
                normal: {
                  show: true,
                  position: label_pos
                }
              }
            });
            var colors = ['rgb(0,255,161)', 'rgb(245,225,67)', 'rgb(252,128,20)', 'rgba(0, 120, 215, 0.6)', 'rgba(0, 120, 215, 0.06)', 'rgb(3,204,215)'];
            var option = {
              color: colors,
              tooltip: {
                trigger: 'axis'
              },
              legend: {
                left: 'center',
                top: 10,
                data: opt.legend,
                textStyle: {
                  fontSize: 12,
                  color: colors
                },
                itemWidth:15,
                itemHeight:6
              },
              grid: {
                left: grid_left,
                right: '3.5%',
                bottom: 30
              },
              xAxis: {
                type: 'category',
                boundaryGap: false,
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
                    fontSize: 12,
                    color: colors[5]
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
              yAxis: {
                type: 'value',
                axisLabel: {
                  formatter: '{value}',
                  textStyle: {
                    color: colors[5]
                  }
                },
                name: opt.y_name,
                nameTextStyle: {
                  color: colors[5]
                },
                min: yAxis_min,
                max: yAxis_max,
                splitBumber: 5,
                interval: (yAxis_max - yAxis_min) / 5,
                axisLine: {
                  lineStyle: {
                    color: colors[3],
                    shadowColor: colors[3],
                    shadowBlur: 4
                  }
                },
                splitLine: {
                  show: true,
                  interval: 'auto',
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
              series: opt.series
            };

            var inner_line_height = $('.inner-line').height();
            var header_height = $('.header').outerHeight(true);
            var main_height = inner_line_height-header_height-15-2-15;
            $('.main').css({'max-height':(inner_line_height-header_height)+'px'});
            $('.travel-main .left-box').css({'max-height':main_height+'px'});
            $('.travel-main .right-box').css({'max-height':main_height+'px'});
            setTimeout(function() {
              chartInstance1 = echarts.init((element.find('div'))[0]);
              chartInstance1.clear();
              chartInstance1.resize();
              chartInstance1.setOption(option);
            }, 600);

            scope.onResize4 = function() {
              var inner_line_height = $('.inner-line').height();
              var header_height = $('.header').outerHeight(true);
              var main_height = inner_line_height-header_height-15-2-15;
              $('.main').css({'max-height':(inner_line_height-header_height)+'px'});
              $('.travel-main .left-box').css({'max-height':main_height+'px'});
              $('.travel-main .right-box').css({'max-height':main_height+'px'});
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
})();
