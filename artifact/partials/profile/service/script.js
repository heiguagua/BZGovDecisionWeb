(function() {
  /** Module */
  var service = angular.module('app.profile.service', []);
  service.$inject = ['$location'];
  /** Controller */
  service.controller('serviceController', [
    '$scope', 'serviceService', '$state', '$stateParams', '$window','$rootScope',
    function($scope, serviceService, $state, $stateParams, $window,$rootScope) {
      var vm = this;
      $('.profile').css({
        'background': 'url(assets/images/bg.png)'
      });

      $scope.servicelist = [];
      var menuId = $stateParams.proid;
      $rootScope.currentMenu = menuId;
      serviceService.getContent({
        menuId: menuId
      }).then(function(result) {
        vm.servicecontent = _.sortBy(result.data, ['picCode']);
        _.forEach(vm.servicecontent, function(item) {
          var chart = {};
          chart.opened = false;
          chart.url = item.url;
          chart.picCode = item.picCode;
          $scope.servicelist.push(chart);
        });

      });


    }
  ]);

  /** Service */
  service.factory('serviceService', ['$http', 'URL',
    function($http, URL) {
      return {
        getMenus: getMenus,
        getDetail: getDetail,
        getContent: getContent,
        getDateFormat: getDateFormat,
        getserviceData: getserviceData
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

      function getserviceData(params) {
        return $http.get(
          URL + '/identity/table', {
            params: params
          }
        )
      }
    }
  ]);

  service.directive('serviceChartConsume', ['agriService', '$window',
    function(agriService, $window) {
      return {
        restrict: 'ACE',
        scope: {
          consumecontent: '='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          var chartInstance1 = null;
          if (!scope.consumecontent || !scope.consumecontent.url) {
            return;
          }
          agriService.getDetail(scope.consumecontent.url, {
            picCode: scope.consumecontent.picCode
          }).then(function(result) {
            var opt = result.data;
            if (!opt || !opt.series) {
              return;
            }
            scope.consumecontent.dep_name = opt.dep_name;
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
              // if ((index + 1) % 2 != 0) {
              //   label_pos = 'bottom';
              // }
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
                    fontSize: 10,
                    color: colors[5]
                  },
                  formatter: function(value) {
                    var month = value.substring(value.indexOf('-') + 1);
                    return Number(month) + '月';
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

  service.directive('serviceChartBank', ['agriService', '$window',
    function(agriService, $window) {
      return {
        restrict: 'ACE',
        scope: {
          bankcontent: '='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          var chartInstance1 = null;
          if (!scope.bankcontent || !scope.bankcontent.url) {
            return;
          }
          agriService.getDetail(scope.bankcontent.url, {
            picCode: scope.bankcontent.picCode
          }).then(function(result) {
            var opt = result.data;
            if (!opt || !opt.series) {
              return;
            }
            scope.bankcontent.dep_name = opt.dep_name;
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
              grid_left = '16%';
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
              // if ((index + 1) % 2 != 0) {
              //   label_pos = 'bottom';
              // }
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
                    fontSize: 10,
                    color: colors[5]
                  },
                  formatter: function(value) {
                    var month = value.substring(value.indexOf('-') + 1);
                    return Number(month) + '月';
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

  // 商品房待售面积
  service.directive('serviceChartHouse', ['agriService', '$window',
    function(agriService, $window) {
      return {
        restrict: 'ACE',
        scope: {
          housecontent: '='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          var chartInstance2 = null;
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
                item.barMaxWidth = '40%';
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
                right: grid_left,
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

  // 企业登记注册
  service.directive('serviceChartEnt', ['agriService', '$window',
    function(agriService, $window) {
      return {
        restrict: 'ACE',
        scope: {
          entcontent: '='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          var chartInstance1 = null;
          if (!scope.entcontent || !scope.entcontent.url) {
            return;
          }
          agriService.getDetail(scope.entcontent.url, {
            picCode: scope.entcontent.picCode
          }).then(function(result) {
            var opt = result.data;
            if (!opt || !opt.series) {
              return;
            }
            scope.entcontent.dep_name = opt.dep_name;
            var yAxis_min = 0;
            var yAxis_max = 0;
            if (opt.max_and_min) {
              yAxis_min = Math.round(opt.max_and_min[0].minValue);
              yAxis_max = Math.round(opt.max_and_min[0].maxValue);
            }
            var screen_width = screen.width;
            var grid_top = '24%';
            var grid_left = '10%';
            var grid_right ='12%';
            if (screen_width < 1600) {
              grid_top = '32%';
              grid_left = '16%';
              grid_right = '20%';
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
                  show:false,
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
                top:2,
                data: opt.legend,
                textStyle: {
                  fontSize: 12,
                  color:colors
                },
                itemWidth:15,
                itemHeight:6
              },
              grid: {
                top: '14%',
                left: grid_left,
                right: '4%',
                bottom: 160
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
                  margin:4,
                  textStyle: {
                    fontSize: 10,
                    color:colors[5]
                  },
                  formatter:function(val) {
                    return val.split("").join("\n"); //横轴信息文字竖直显示
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

  // 货物运输周转量
  service.directive('serviceChartGoods', ['agriService', '$window',
    function(agriService, $window) {
      return {
        restrict: 'ACE',
        scope: {
          goodscontent: '='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          var chartInstance1 = null;
          if (!scope.goodscontent || !scope.goodscontent.url) {
            return;
          }
          agriService.getDetail(scope.goodscontent.url, {
            picCode: scope.goodscontent.picCode
          }).then(function(result) {
            var opt = result.data;
            if (!opt || !opt.series) {
              return;
            }
            scope.goodscontent.dep_name = opt.dep_name;
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
              grid_left = '16%';
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
              // if ((index + 1) % 2 != 0) {
              //   label_pos = 'bottom';
              // }
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
                    fontSize: 10,
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

  // 货物运输周转量
  service.directive('serviceChartTraffic', ['agriService', '$window',
    function(agriService, $window) {
      return {
        restrict: 'ACE',
        scope: {
          trafficontent: '='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          var chartInstance1 = null;
          if (!scope.trafficontent || !scope.trafficontent.url) {
            return;
          }
          agriService.getDetail(scope.trafficontent.url, {
            picCode: scope.trafficontent.picCode
          }).then(function(result) {
            var opt = result.data;
            if (!opt || !opt.series) {
              return;
            }
            scope.trafficontent.dep_name = opt.dep_name;
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
              grid_left = '16%';
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
              // if ((index + 1) % 2 != 0) {
              //   label_pos = 'bottom';
              // }
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
                    fontSize: 10,
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
})();
