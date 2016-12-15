(function() {
  /** Module */
  var industry = angular.module('app.profile.industry', []);
  industry.$inject = ['$location'];
  /** Controller */
  industry.controller('industryController', [
    '$scope', 'industryService', '$state', '$stateParams', '$window',
    function($scope, industryService, $state, $stateParams, $window) {
      var vm = this;
      $('.profile').css({
        'background': 'url(assets/images/bg.png)'
      });

      $scope.indstlist = [];
      var menuId = $stateParams.proid;
      industryService.getContent({
        menuId: 7
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
          var chartInstance4 = null;
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
              grid_left = '16%';
            }
            var colors = ['rgb(255,169,34)', 'rgb(0,152,72)', 'rgb(0,168,228)', 'rgba(0, 120, 215, 0.6)', 'rgba(0, 120, 215, 0.06)'];
            var option = {
              color: colors,
              tooltip: {
                trigger: 'axis'
              },
              legend: {
                orient: 'vertical',
                left: 'right',
                data: opt.legend,
                textStyle: {
                  color: '#d5e2df',
                  fontSize: 12
                }
              },
              grid: {
                //right:'3%',
                top: '24%',
                left: grid_left,
                bottom: 30
              },
              xAxis: {
                type: 'category',
                boundaryGap: false,
                data: opt.x_data,
                axisLine: {
                  lineStyle: {
                    color: colors[2],
                    shadowColor: colors[2],
                    shadowBlur: 4
                  }
                },
                axisLabel: {
                  interval: 0,
                  textStyle: {
                    fontSize: 10
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
                  formatter: '{value}'
                },
                name: opt.y_name,
                min: yAxis_min,
                max: yAxis_max,
                splitBumber: 5,
                interval: (yAxis_max - yAxis_min) / 5,
                axisLine: {
                  lineStyle: {
                    color: colors[2],
                    shadowColor: colors[2],
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

  // 经济类型增速分析
  industry.directive('indstChartEco', ['industryService', '$window',
    function(industryService, $window) {
      return {
        restrict: 'ACE',
        scope: {
          eco: '='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          var chartInstance6 = null;
          // if (!scope.regcontent || !scope.regcontent.url) {
          //   return;
          // }
          // industryService.getDetail(scope.regcontent.url, {
          //   queryTime: industryService.getDateFormat(scope.regcontent.model, scope.regcontent.format),
          //   picCode: scope.regcontent.picCode
          // }).then(function(result) {
          //   var opt = result.data;
          //   if (!opt || !opt.series) {
          //     return;
          //   }
          //   scope.regcontent.query_time = opt.init_query_time;
          //   scope.regcontent.dep_name = opt.dep_name;
          //   var yAxis_min = 0;
          //   var yAxis_max = 0;
          //   if (opt.max_and_min) {
          //     yAxis_min = Math.round(opt.max_and_min[0].minValue);
          //     yAxis_max = Math.round(opt.max_and_min[0].maxValue);
          //   }
          //   var screen_width = screen.width;
          //   var grid_top = '24%';
          //   var grid_left = '10%';
          //   if (screen_width < 1600) {
          //     grid_top = '32%';
          //     grid_left = '16%';
          //   }
          var option = {
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              left: 'right',
              data: [{
                name: '同比增速',
                icon: 'diamond'
              }],
              textStyle: {
                color: 'rgb(236,206,15)'
              }
            },
            radar: [{
              name: {
                textStyle: {
                  color: 'rgb(0,255,246)',
                  fontSize: 14
                }
              },
              nameGap: 6,
              axisLine: {
                show: false
              },
              splitLine: {
                lineStyle: {
                  color: 'rgb(01,106,224)'
                }
              },
              splitArea: {
                show: false
              },
              indicator: [{
                text: '国有企业增加值增速',
                max: 100
              }, {
                text: '外商及港澳台商投资企业增加值增速',
                max: 100
              }, {
                text: '私营企业增加值增速',
                max: 100
              }, {
                text: '股份制企业增加值增速',
                max: 100
              }, {
                text: '集体企业增加值增速',
                max: 100
              }],
              center: ['50%', '50%'],
              radius: '80%'
            }],
            series: [{
              type: 'radar',
              symbolSize: 0,
              tooltip: {
                trigger: 'item'
              },
              itemStyle: {
                normal: {
                  color: 'rgb(236,206,15)'
                }
              },
              lineStyle: {
                normal: {
                  color: 'rgb(236,206,15)'
                }
              },
              data: [{
                value: [60, 10, 60, 42, 60],
                name: '同比增速',
                areaStyle: {
                  normal: {
                    opacity: 0.8,
                    color: 'rgb(173,168,70)'
                  }
                }
              }]
            }]
          };
          var screen_width = screen.width;
          if (screen_width < 1600) {
            option.radar[0].name.textStyle.fontSize = 10;
          }

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
            // })
        }
      }
    }
  ]);

  industry.directive('indstChartPro', ['industryService', '$window',
    function(industryService, $window) {
      return {
        restrict: 'ACE',
        scope: {
          regcontent: '='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          var chartInstance4 = null;
          // if (!scope.regcontent || !scope.regcontent.url) {
          //   return;
          // }
          // industryService.getDetail(scope.regcontent.url, {
          //   picCode: scope.regcontent.picCode
          // }).then(function(result) {
          // var opt = result.data;
          // if (!opt || !opt.series) {
          //   return;
          // }
          // scope.regcontent.dep_name = opt.dep_name;
          // var yAxis_min = 0;
          // var yAxis_max = 0;
          // if (opt.max_and_min) {
          //   yAxis_min = Math.round(opt.max_and_min[0].minValue);
          //   yAxis_max = Math.round(opt.max_and_min[0].maxValue);
          // }

          var colors = ['rgb(255,169,34)', 'rgb(0,152,72)', 'rgb(0,168,228)', 'rgba(0, 120, 215, 0.6)', 'rgba(0, 120, 215, 0.06)', 'rgba(0, 255, 161, 0.9)'];
          var option = {
            color: ['#3398DB'],
            tooltip: {
              trigger: 'axis',
              axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            legend: {
              left: 'center',
              width: 20,
              height: 20,
              data: [{
                name: '直接访问',
                icon: 'rect'
              }],
              textStyle: {
                color: '#FFF',
                fontSize: 12
              }
            },
            grid: {
              top: '18%',
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: [{
              type: 'category',
              data: ['铁矿石原矿', '自来水生产量', '大米', '精制食用植物油', '鲜冷藏冻肉', '白酒', '软饮料', '精制茶', '纱', '家具', '纸制品', '中成药', '塑料制品'],
              axisTick: {
                alignWithLabel: false
              },
              axisLine: {
                lineStyle: {
                  color: colors[2],
                  shadowColor: colors[2],
                  shadowBlur: 4
                }
              },
              axisLabel: {
                interval: 0,
                textStyle: {
                  fontSize: 10,
                  color: colors[5]
                },

                formatter: function(val) {
                    var char_length = val.length;
                    var newstr = val;
                    _.forEach(val, function(char, index) {
                      if (char_length > 4) {
                        var strTemp = '';
                        var leftStr = ''
                        if ((index + 1) % 2 == 0) {
                          strTemp = val.substring(0, index+1);
                          console.log(strTemp);
                          leftStr = val.substring(index+1, char_length);
                          newstr =  strTemp + '\n' + leftStr;
                        }
                      }
                    })

                    return newstr;
                  }
                  //   if (val.indexOf('月') > -1) {
                  //     return val;
                  //   }
                  //   return val.split("").join("\n"); //横轴信息文字竖直显示
                  // }
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
            }],
            yAxis: [{
              type: 'value',
              name: '??',
              axisLine: {
                lineStyle: {
                  color: colors[2],
                  shadowColor: colors[2],
                  shadowBlur: 4
                }
              },
              axisLabel: {
                textStyle: {
                  color: colors[5]
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
            }],
            series: [{
              name: '直接访问',
              type: 'bar',
              barWidth: '60%',
              itemStyle: {
                normal: {
                  color: colors[5]
                }
              },
              data: [10, 52, 200, 334, 390, 330, 220, 120, 34, 231, 123, 34, 232]
            }]
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
            //})
        }
      }
    }
  ]);

})();
