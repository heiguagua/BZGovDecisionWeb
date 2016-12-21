(function() {
  /** Module */
  var industry = angular.module('app.profile.industry', []);
  industry.$inject = ['$location'];
  /** Controller */
  industry.controller('industryController', [
    '$scope', 'industryService', '$state', '$stateParams', '$window','$rootScope',
    function($scope, industryService, $state, $stateParams, $window,$rootScope) {
      var vm = this;
      $rootScope.showMenu = true;
      $('.profile').css({
        'background': 'url(assets/images/bg.png)'
      });

      $scope.indstlist = [];
      var menuId = $stateParams.proid;
      $rootScope.currentMenu = menuId;
      industryService.getContent({
        menuId: menuId
      }).then(function(result) {
        vm.indstcontent = _.sortBy(result.data, ['picCode']);
        _.forEach(vm.indstcontent, function(item) {
          var chart = {};
          chart.opened = false;
          chart.url = item.url;
          chart.picCode = item.picCode;
          $scope.indstlist.push(chart);
        });

      });

      // 主要经济指标
      industryService.getindustryData({
        picCode: 2003
      }).then(function(result) {
        vm.industryData = result.data;
        $('.datalist').mCustomScrollbar();
      })

    }
  ]);

  /** Service */
  industry.factory('industryService', ['$http', 'URL',
    function($http, URL) {
      return {
        getMenus: getMenus,
        getDetail: getDetail,
        getContent: getContent,
        getDateFormat: getDateFormat,
        getindustryData: getindustryData
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

      function getindustryData(params) {
        return $http.get(
          URL + '/identity/table', {
            params: params
          }
        )
      }
    }
  ]);

  industry.directive('indstChartReg', ['industryService', '$window',
    function(industryService, $window) {
      return {
        restrict: 'ACE',
        scope: {
          regcontent: '='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          var chartInstance1 = null;
          if (!scope.regcontent || !scope.regcontent.url) {
            return;
          }
          industryService.getDetail(scope.regcontent.url, {
            picCode: scope.regcontent.picCode
          }).then(function(result) {
            var opt = result.data;
            if (!opt || !opt.series) {
              return;
            }
            if (!scope.regcontent.model && opt.init_query_time != '') {
              scope.regcontent.model = new Date(opt.init_query_time);
            }
            scope.regcontent.query_time = opt.init_query_time;
            scope.regcontent.dep_name = opt.dep_name;
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
              grid_left = '12%';
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
                top: 15,
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


  // 固定资产投资
  industry.directive('indstChartInvest', ['industryService', '$window',
    function(industryService, $window) {
      return {
        restrict: 'ACE',
        scope: {
          invstcontent: '='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          var chartInstance2 = null;
          if (!scope.invstcontent || !scope.invstcontent.url) {
            return;
          }
          industryService.getDetail(scope.invstcontent.url, {
            picCode: scope.invstcontent.picCode
          }).then(function(result) {
            var opt = result.data;
            if (!opt || !opt.series) {
              return;
            }
            if (!scope.invstcontent.model && opt.init_query_time != '') {
              scope.invstcontent.model = new Date(opt.init_query_time);
            }
            scope.invstcontent.query_time = opt.init_query_time;
            scope.invstcontent.dep_name = opt.dep_name;
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
              grid_left = '12%';
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
                    fontSize: 12,
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


  // 经济类型增速分析
  industry.directive('indstChartEco', ['industryService', '$window',
    function(industryService, $window) {
      return {
        restrict: 'ACE',
        scope: {
          ecocontent: '='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          var chartInstance6 = null;
          if (!scope.ecocontent || !scope.ecocontent.url) {
            return;
          }
          industryService.getDetail(scope.ecocontent.url, {
            picCode: scope.ecocontent.picCode
          }).then(function(result) {
            var opt = result.data;
            if (!opt || !opt.series) {
              return;
            }
            if (!scope.ecocontent.model && opt.init_query_time != '') {
              scope.ecocontent.model = new Date(opt.init_query_time);
            }
            scope.ecocontent.query_time = opt.init_query_time;
            scope.ecocontent.dep_name = opt.dep_name;
            var yAxis_min = 0;
            var yAxis_max = 0;
            if (opt.max_and_min) {
              yAxis_min = Math.round(opt.max_and_min[0].minValue);
              yAxis_max = Math.round(opt.max_and_min[0].maxValue);
            }
            var screen_width = screen.width;
            var grid_top = '24%';
            var grid_left = '10%';
            var radius = '80%';
            if (screen_width < 1600) {
              grid_top = '32%';
              grid_left = '16%';
              radius = '60%';
            }

            var indicators = [];
            _.forEach(opt.x_data, function(item, index) {
              var indicator = {};
              indicator.name = item;
              indicator.name.show = true;
              var max = 0;
              var min = 0;
              if (opt.series[0].data.length == 1) {
                var dataArray = _.map(opt.series[0].data, 'value')[0];
                max = Number(dataArray[index]);
                min = Number(dataArray[index]);
                _.forEach(dataArray[0], function(data, index2) {
                  if (Number(dataArray[index2]) > max) {
                    max = Number(dataArray[index2]);
                  }
                  if (Number(dataArray[index2]) < min) {
                    min = Number(dataArray[index2]);
                  }
                });
              } else {
                var dataArray = _.map(opt.series[0].data, 'value');
                var dataAll = [];
                _.forEach(dataArray, function(data, index2) {
                  dataAll = _.concat(data, dataAll);
                });
                max = Number(dataAll[0]);
                min = Number(dataAll[0]);
                _.forEach(dataAll, function(data) {
                  if (Number(data) > max) {
                    max = Number(data);
                  }
                  if (Number(data) < min) {
                    min = Number(data);
                  }
                });
              }

              indicator.max = max;
              indicator.min = min * 0.8;
              indicators.push(indicator);
            });
            _.forEach(opt.series, function(item) {
              item.symbol ='diamond';
              item.symbolSize = 0;
              item.itemStyle = {
                normal: {
                  color: 'rgb(236,206,15)'
                }
              };
              item.lineStyle = {
                normal: {
                  color: 'rgb(236,206,15)'
                }
              };
              item.data[0].areaStyle = {
                normal: {
                  opacity: 0.8,
                  color: 'rgb(173,168,70)'
                }
              }
            })
            var option = {};
            // option.color = colors;
            option.tooltip = {};
            option.legend = {
              left: 'right',
              data: opt.legend,
              textStyle: {
                color: 'rgb(236,206,15)'
              },
              itemWidth:15,
              itemHeight:6
            };
            option.radar = {};
            option.radar.center = ['50%', '50%'];
            option.radar.name = {
              show:true,
              textStyle: {
                color: 'rgb(0,255,246)',
                fontSize: 12
              },
              formatter : function(val) {
                var char_length = val.length;
                var newstr = '';
                if (char_length > 4) {
                  var strTemp = '';
                  var leftStr = '';
                  //for(var i=0; i<(char_length/5); i++) {
                    //if(i != 0) {
                    strTemp = val.substring(0, char_length-5);
                    if(strTemp.length>8) {
                      var temp1 = strTemp.substring(0, strTemp.length-5);
                      var temp2 = strTemp.substring(strTemp.length-5);
                      strTemp = temp1 + '\n' + temp2;
                    }
                    leftStr = val.substring(char_length-5);
                      newstr = strTemp + '\n' + leftStr;
                    //}
                  //}
                }
                else{
                  newstr = val;
                }
                return newstr;
              }
            };
            option.radar.nameGap = 8;
            option.radar.radius = radius;
            option.radar.axisLine = {
              show: false
            };
            option.radar.splitLine = {
              lineStyle: {
                color: 'rgb(01,106,224)'
              }
            };
            option.radar.splitArea = {
              show: false
            };
            option.radar.indicator = indicators;
            option.series = opt.series;
            // var option = {
            //   tooltip: {
            //     trigger: 'axis'
            //   },
            //   legend: {
            //     left: 'right',
            //     data: [{
            //       name: '同比增速',
            //       icon: 'diamond'
            //     }],
            //     textStyle: {
            //       color: 'rgb(236,206,15)'
            //     }
            //   },
            //   radar: [{
            //     name: {
            //       textStyle: {
            //         color: 'rgb(0,255,246)',
            //         fontSize: 14
            //       }
            //     },
            //     nameGap: 6,
            //     axisLine: {
            //       show: false
            //     },
            //     splitLine: {
            //       lineStyle: {
            //         color: 'rgb(01,106,224)'
            //       }
            //     },
            //     splitArea: {
            //       show: false
            //     },
            //     indicator: [{
            //       text: '国有企业增加值增速',
            //       max: 100
            //     }, {
            //       text: '外商及港澳台商投资企业增加值增速',
            //       max: 100
            //     }, {
            //       text: '私营企业增加值增速',
            //       max: 100
            //     }, {
            //       text: '股份制企业增加值增速',
            //       max: 100
            //     }, {
            //       text: '集体企业增加值增速',
            //       max: 100
            //     }],
            //     center: ['50%', '50%'],
            //     radius: '80%'
            //   }],
            //   series: [{
            //     type: 'radar',
            //     symbolSize: 0,
            //     tooltip: {
            //       trigger: 'item'
            //     },
            //     itemStyle: {
            //       normal: {
            //         color: 'rgb(236,206,15)'
            //       }
            //     },
            //     lineStyle: {
            //       normal: {
            //         color: 'rgb(236,206,15)'
            //       }
            //     },
            //     data: [{
            //       value: [60, 10, 60, 42, 60],
            //       name: '同比增速',
            //       areaStyle: {
            //         normal: {
            //           opacity: 0.8,
            //           color: 'rgb(173,168,70)'
            //         }
            //       }
            //     }]
            //   }]
            // };

            setTimeout(function() {
              chartInstance6 = echarts.init((element.find('div'))[0]);
              chartInstance6.clear();
              chartInstance6.resize();
              chartInstance6.setOption(option);
            }, 600);

            scope.onResize4 = function() {
              if (chartInstance6) {
                chartInstance6.clear();
                chartInstance6.resize();
                chartInstance6.setOption(option);
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

  industry.directive('indstChartPro', ['industryService', '$window',
    function(industryService, $window) {
      return {
        restrict: 'ACE',
        scope: {
          procontent: '='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          var chartInstance4 = null;
          if (!scope.procontent || !scope.procontent.url) {
            return;
          }
          industryService.getDetail(scope.procontent.url, {
            picCode: scope.procontent.picCode
          }).then(function(result) {
            var opt = result.data;
            if (!opt || !opt.series) {
              return;
            }
            if (!scope.procontent.model && opt.init_query_time != '') {
              scope.procontent.model = new Date(opt.init_query_time);
            }
            scope.procontent.query_time = opt.init_query_time;
            scope.procontent.dep_name = opt.dep_name;
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
                item.barMaxWidth = '45%';
              }
              if(item.type == 'line') {
                item.connectNulls = true;
              }
              item.label = {
                normal: {
                  show: false,
                  position: 'top'
                }
              };
            });
            var screen_width = screen.width;
            var grid_top = 60;
            var grid_left = '10%';
            if (screen_width < 1600) {
              grid_top = '16%';
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
                top: grid_top,
                left: grid_left,
                right: '2%',
                bottom: 100
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
                  margin:8,
                  textStyle: {
                    fontSize: 12,
                    color: colors[5]
                  },
                  formatter: function(val) {
                    return val.split("").join("\n"); //横轴信息文字竖直显示
                    // var char_length = val.length;
                    // var newstr = '';
                    // var screen_width = screen.width;
                    // if (screen_width < 1600) {
                    //   return val.split("").join("\n"); //横轴信息文字竖直显示
                    // }
                    // else{
                    //   if (char_length > 3) {
                    //     var strTemp = '';
                    //     var leftStr = '';
                    //     for(var i=0; i<(char_length/2); i++) {
                    //       if(i != 0) {
                    //         if(val.length<2 || val.length == 3) {
                    //           strTemp = val;
                    //         }
                    //         else{
                    //           strTemp = val.substring(0, 2);
                    //           val = val.substring(2, val.length);
                    //         }
                    //
                    //         newstr += strTemp + '\n';
                    //       }
                    //     }
                    //   }
                    //   else{
                    //     newstr = val;
                    //   }
                    //   return newstr;
                    // }
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

  industry.directive('indstChartElec', ['industryService', '$window',
    function(industryService, $window) {
      return {
        restrict: 'ACE',
        scope: {
          eleccontent: '='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          var chartInstance4 = null;
          if (!scope.eleccontent || !scope.eleccontent.url) {
            return;
          }
          industryService.getDetail(scope.eleccontent.url, {
            picCode: scope.eleccontent.picCode
          }).then(function(result) {
            var opt = result.data;
            if (!opt || !opt.series) {
              return;
            }
            if (!scope.eleccontent.model && opt.init_query_time != '') {
              scope.eleccontent.model = new Date(opt.init_query_time);
            }
            scope.eleccontent.query_time = opt.init_query_time;
            scope.eleccontent.dep_name = opt.dep_name;
            var yAxis_min = 0;
            var yAxis_max = 0;
            if (opt.max_and_min) {
              yAxis_min = Math.round(opt.max_and_min[0].minValue);
              yAxis_max = Math.round(opt.max_and_min[0].maxValue);
            }
            var screen_width = screen.width;
            var grid_top = 60;
            var grid_left = '10%';
            if (screen_width < 1600) {
              grid_top = '16%';
              grid_left = '12%';
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
                    fontSize: 12,
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

            // var inner_line_height = $('.inner-line').height();
            // var header_height = $('.header').outerHeight(true);
            // var main_height = inner_line_height-header_height-15-2-15;
            // $('.main').css({'max-height':(inner_line_height-header_height)+'px'});
            // $('.top-box').css({'max-height':main_height/2+'px'});
            // $('.down-box').css({'max-height':main_height/2+'px'});
            // var center_top_height = $('.top-box').outerHeight(true);
            // var center_down_height = $('.down-box').outerHeight(true);
            // $('.right-table').css({'max-height':center_top_height-15+'px'});

            setTimeout(function() {
              chartInstance4 = echarts.init((element.find('div'))[0]);
              chartInstance4.clear();
              chartInstance4.resize();
              chartInstance4.setOption(option);
            }, 600);

            scope.onResize4 = function() {
              // var inner_line_height = $('.inner-line').height();
              // var header_height = $('.header').outerHeight(true);
              // var main_height = inner_line_height-header_height-15-2-15;
              // $('.main').css({'max-height':(inner_line_height-header_height)+'px'});
              // $('.top-box').css({'max-height':main_height/2+'px'});
              // $('.down-box').css({'max-height':main_height/2+'px'});
              // var center_top_height = $('.top-box').outerHeight(true);
              // var center_down_height = $('.down-box').outerHeight(true);
              // $('.right-table').css({'max-height':center_top_height-15+'px'});
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
})();
