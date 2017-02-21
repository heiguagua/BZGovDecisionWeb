(function() {
  /** Module */
  var spot = angular.module('app.profile.spot', ['angular-bootstrap-select',
    'angular-bootstrap-select.extra'
  ]);
  spot.$inject = ['$location'];
  /** Controller */
  spot.controller('spotController', [
    '$scope', 'spotService', '$state', '$stateParams', '$window', '$rootScope',
    function($scope, spotService, $state, $stateParams, $window, $rootScope) {
      var vm = this;
      $rootScope.showMenu = true;
      $scope.isActive = 1;

      $('.profile').css({
        'background': 'url(assets/images/bg.png)'
      });

      $scope.showChart = function(num) {
        if(num == 1) {
          $scope.rankdata = null;
          $scope.rankrate = null;
          $scope.targetcrt = null;
          $scope.targetgoal = null;
          $scope.targetrate = null;
        }
        if(num == 2) {
          $scope.rankdata = 2;
          $scope.rankrate = 2;
          $scope.targetcrt = null;
          $scope.targetgoal = null;
          $scope.targetrate = null;
        }
        if( num == 3) {
          $scope.rankdata = null;
          $scope.rankrate = null;
          $scope.targetcrt = 3;
          $scope.targetgoal = 3;
          $scope.targetrate = 3;
        }
        $scope.isActive = num;


      }

      $scope.menuactive = 0;
      $scope.tabMenu = function(index) {
        $scope.menuactive = index;
      }

      $scope.menus = [{
        'id': 1,
        'name': 'GDP',
        'star': 1
      }, {
        'id': 2,
        'name': '投资',
        'star': 2
      }, {
        'id': 3,
        'name': '工业',
        'star': 3
      }, {
        'id': 4,
        'name': '社会消费',
        'star': 2
      }, {
        'id': 5,
        'name': '财政收支',
        'star': 2
      }, {
        'id': 6,
        'name': '金融',
        'star': 3
      }, {
        'id': 7,
        'name': '居民收支',
        'star': 1
      }, {
        'id': 8,
        'name': '物价',
        'star': 3
      }, ]

      $scope.quarterOptions = [{
        'id': 3,
        "name": "第1季度"
      }, {
        'id': 6,
        "name": "1-2季度"
      }, {
        'id': 9,
        "name": "1-3季度"
      }, {
        'id': 12,
        "name": "1-4季度"
      }];

      $scope.quarter = 3;

      $scope.datepick = {};
      $scope.datepick.format = 'yyyy';
      $scope.datepick.model = new Date();
      $scope.datepick.dateOptions = {};
      $scope.datepick.dateOptions.minMode = 'year';
      $scope.datepick.dateOptions.datepickerMode = 'year';
      $scope.altInputFormats = ['M!/d!/yyyy'];

      $scope.open = function() {
        $scope.datepick.opened = true;
      };

      $scope.spotlist = [];
      var menuId = $stateParams.proid;
      $rootScope.currentMenu = menuId;
      // spotService.getContent({
      //   menuId: menuId
      // }).then(function(result) {
      //   vm.spotcontent = _.sortBy(result.data, ['picCode']);
      //   _.forEach(vm.spotcontent, function(item) {
      //     var chart = {};
      //     chart.opened = false;
      //     chart.url = item.url;
      //     chart.picCode = item.picCode;
      //     $scope.spotlist.push(chart);
      //   });
      //
      // });

      // 主要经济指标
      // spotService.getspotData({
      //   picCode: 5003
      // }).then(function(result) {
      //   vm.spotData = result.data;
      //   $('.datalist').mCustomScrollbar();
      // })

      // spotService.getspotData({
      //   picCode: 5007
      // }).then(function(result) {
      //   vm.spotDataDown = result.data;
      //   $('.datalist').mCustomScrollbar();
      // })

    }
  ]);

  /** spot */
  spot.factory('spotService', ['$http', 'URL',
    function($http, URL) {
      return {
        getMenus: getMenus,
        getDetail: getDetail,
        getContent: getContent,
        getDateFormat: getDateFormat
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
    }
  ]);

  spot.directive('chartIncreaseRate', ['spotService', '$window',
    function(spotService, $window) {
      return {
        restrict: 'ACE',
        scope: {
          consumecontent: '='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          var chartInstance = null;
          // if (!scope.consumecontent || !scope.consumecontent.url) {
          //   return;
          // }
          // spotService.getDetail(scope.consumecontent.url, {
          //   picCode: scope.consumecontent.picCode
          // }).then(function(result) {
          //   var opt = result.data;
          //   if (!opt || !opt.series) {
          //     return;
          //   }
          var colors = ['rgb(0,255,161)', 'rgb(245,225,67)', 'rgb(252,128,20)', 'rgba(0, 120, 215, 0.6)', 'rgba(0, 120, 215, 0.06)', 'rgb(3,204,215)'];
          var option = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              },
              formatter: "{a} <br/>{b} : {c}"
            },
            grid: {
              left: '9%',
              right: '8%',
              bottom: '8%',
              top: '8%',
              containLabel: true
            },
            xAxis: {
              type: 'value',
              name: '%',
              nameLocation: 'end',
              position: 'top',
              axisTick: {
                show: false
              },
              axisLabel: {
                show: false
              },
              axisLine: {
                show: false
              },
              splitLine: {
                show: false
              }
            },
            yAxis: {
              type: 'category',
              name: '',
              nameLocation: 'start',
              boundaryGap: true,
              axisTick: {
                show: false
              },
              axisLine: {
                show: true,
                lineStyle: {
                  color: 'rgba(0, 120, 255, 0.5)'
                }
              },
              axisLabel: {
                textStyle: {
                  color: 'rgb(246,246,246)',
                  fontSize: 14
                }
              },
              inverse: 'true', //排序
              data: [
                '全国',
                '全省',
                '巴中',
                '上年同期'
              ]
            },
            series: [{
              name: '同比增速',
              type: 'bar',
              barMaxWidth: '50%',
              label: {
                normal: {
                  show: true,
                  position: 'right',
                  formatter: '{c}%',
                  textStyle: {
                    color: 'rgb(246,246,246)',
                    fontSize: 14
                  }
                }
              },
              itemStyle: {
                normal: {
                  color: 'rgb(7,83,181)'
                }
              },
              data: [42, 36, 35, 28]
            }]
          };

          setTimeout(function() {
            chartInstance = echarts.init((element.find('div'))[0]);
            chartInstance.clear();
            chartInstance.resize();
            chartInstance.setOption(option);
          }, 600);

          scope.onResize = function() {
            if (chartInstance) {
              chartInstance.clear();
              chartInstance.resize();
              chartInstance.setOption(option);
            }
          }

          angular.element($window).bind('resize', function() {
              scope.onResize();
            })
            // })
        }
      }
    }
  ]);

  spot.directive('chartRankTotal', ['spotService', '$window',
    function(spotService, $window) {
      return {
        restrict: 'ACE',
        scope: {
          rankdata: '='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          var chartInstance1 = null;
          // if (!scope.rankdata || !scope.rankdata.url) {
          //   return;
          // }
          // spotService.getDetail(scope.rankdata.url, {
          //   picCode: scope.rankdata.picCode
          // }).then(function(result) {
          //   var opt = result.data;
          //   if (!opt || !opt.series) {
          //     return;
          //   }
          var colors = ['rgb(0,255,161)', 'rgb(245,225,67)', 'rgb(252,128,20)', 'rgba(0, 120, 215, 0.6)', 'rgba(0, 120, 215, 0.06)', 'rgb(3,204,215)'];
          // var option = {
          //   tooltip: {
          //     trigger: 'axis',
          //     axisPointer: {
          //       type: 'shadow'
          //     },
          //     formatter: "{a} <br/>{b} : {c}"
          //   },
          //   grid: {
          //     left: '12%',
          //     right: '12%',
          //     bottom: '12%',
          //     top: '12%',
          //     containLabel: true
          //   },
          //   yAxis: {
          //     type: 'value',
          //     axisTick: {
          //       show: false
          //     },
          //     axisLabel: {
          //       show: false
          //     },
          //     axisLine: {
          //       show: false
          //     },
          //     splitLine: {
          //       show: false
          //     }
          //   },
          //   xAxis: {
          //     type: '',
          //     name: '',
          //     nameLocation: 'start',
          //     boundaryGap: true,
          //     axisTick: {
          //       show: false
          //     },
          //     axisLine: {
          //       show: true,
          //       lineStyle: {
          //         color: 'rgba(0, 120, 255, 0.5)'
          //       }
          //     },
          //     axisLabel: {
          //       textStyle: {
          //         color: 'rgb(246,246,246)',
          //         fontSize: 14
          //       }
          //     },
          //     inverse: 'true', //排序
          //     data: [
          //       '广元',
          //       '广安',
          //       '南充',
          //       '达州',
          //       '巴中'
          //     ]
          //   },
          //   series: [{
          //     name: '同比增速',
          //     type: 'bar',
          //     barMaxWidth: '30%',
          //     label: {
          //       normal: {
          //         show: true,
          //         position: 'top',
          //         formatter: '{c}',
          //         textStyle: {
          //           color: 'rgb(246,246,246)',
          //           fontSize: 14
          //         }
          //       }
          //     },
          //     itemStyle: {
          //       normal: {
          //         color: 'rgb(7,83,181)'
          //       }
          //     },
          //     data: [42, 36, 35, 28, 45]
          //   }]
          // };

          var option = {
            // color:['rgb(195,211,234)','rgb(2,230,239)'],
            legend: {
              orient: 'vertical',
              left: 'left'
            },
            series: [{
              name: '川东北经济区排位',
              type: 'map',
              map: 'chuan_east_north',
              left: '20%',
              top: 20,
              right: '20%',
              bottom: 10,
              selectedMode: 'single',
              label: {
                normal: {
                  show: true,
                  textStyle: {
                    color: '#FFF',
                    fontSize: 16
                  }
                },
                emphasis: {
                  show: true
                }
              },
              itemStyle: {
                normal: {
                  areaColor: 'rgba(0, 120, 255, 0.8)',
                  // color: 'rgb(195,211,234)',
                  color: new echarts.graphic.RadialGradient(0, 0, 8, [{
                    offset: 0,
                    color: 'rgb(195,211,234)' // 0% 处的颜色
                  }, {
                    offset: 1,
                    color: 'rgb(195,211,234)' // 0% 处的颜色
                  }], false),
                  borderColor: 'rgba(42,180,238,1)',
                  borderType: 'solid',
                }
              },
              markPoint: {
                symbol: 'pin',
                symbolSize: 50
              }

            }]
          };

          setTimeout(function() {
            chartInstance1 = echarts.init((element.find('div'))[0]);
            chartInstance1.clear();
            chartInstance1.resize();
            chartInstance1.setOption(option);
          }, 600);

          scope.onResize2 = function() {
            if (chartInstance1) {
              chartInstance1.clear();
              chartInstance1.resize();
              chartInstance1.setOption(option);
            }
          }

          angular.element($window).bind('resize', function() {
              scope.onResize2();
            })
            // })
        }
      }
    }
  ]);

  spot.directive('chartTargetCrt', ['spotService', '$window',
    function(spotService, $window) {
      return {
        restrict: 'ACE',
        scope: {
          targetcrtdata: '='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          var chartInstance = null;
          // if (!scope.targetcrtdata || !scope.targetcrtdata.url) {
          //   return;
          // }
          // spotService.getDetail(scope.targetcrtdata.url, {
          //   picCode: scope.targetcrtdata.picCode
          // }).then(function(result) {
          //   var opt = result.data;
          //   if (!opt || !opt.series) {
          //     return;
          //   }
          var colors = ['rgb(0,255,161)', 'rgb(245,225,67)', 'rgb(252,128,20)', 'rgba(0, 120, 215, 0.6)', 'rgba(0, 120, 215, 0.06)', 'rgb(3,204,215)'];

          var option = {
            title: {
              text: '2016年：530亿元',
              left: 'center',
              top: 'bottom',
              textStyle: {
                color: 'rgb(240,240,240)',
                fontWeight: 'normal'
              }
            },
            series: [{
              type: 'liquidFill',
              data: [0.6],
              radius: '62%',
              outline: {
                borderDistance: 0,
                itemStyle: {
                  borderWidth: 5,
                  borderColor: '#156ACF',
                }
              },
              label: {
                normal: {
                  show: false,
                  textStyle: {
                    fontSize: 30
                  }
                }
              }
            }]
          };


          setTimeout(function() {
            chartInstance = echarts.init((element.find('div'))[0]);
            chartInstance.clear();
            chartInstance.resize();
            chartInstance.setOption(option);
          }, 600);

          scope.onResize3 = function() {
            if (chartInstance) {
              chartInstance.clear();
              chartInstance.resize();
              chartInstance.setOption(option);
            }
          }

          angular.element($window).bind('resize', function() {
              scope.onResize3();
            })
            // })
        }
      }
    }
  ]);

  spot.directive('chartTargetGoal', ['spotService', '$window',
    function(spotService, $window) {
      return {
        restrict: 'ACE',
        scope: {
          targetgoaldata: '='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          var chartInstance = null;
          // if (!scope.targetgoaldata || !scope.targetgoaldata.url) {
          //   return;
          // }
          // spotService.getDetail(scope.targetgoaldata.url, {
          //   picCode: scope.targetgoaldata.picCode
          // }).then(function(result) {
          //   var opt = result.data;
          //   if (!opt || !opt.series) {
          //     return;
          //   }
          var colors = ['rgb(0,255,161)', 'rgb(245,225,67)', 'rgb(252,128,20)', 'rgba(0, 120, 215, 0.6)', 'rgba(0, 120, 215, 0.06)', 'rgb(3,204,215)'];
          var percent = 0.6;

          function getData() {
            return [{
              value: percent,
              itemStyle: {
                normal: {
                  color: '#f2c967',
                  shadowBlur: 10,
                  shadowColor: '#f2c967'
                }
              }
            }, {
              value: 1 - percent,
              itemStyle: {
                normal: {
                  color: 'transparent'
                }
              }
            }];
          }
          var option = {
            title: {
              text: '2020年：800亿元',
              left: 'center',
              top: 'bottom',
              textStyle: {
                color: 'rgb(240,240,240)',
                fontWeight: 'normal'
              }
            },
            series: [{
              type: 'liquidFill',
              data: [1.6],
              radius: '62%',
              outline: {
                borderDistance: 0,
                itemStyle: {
                  borderWidth: 5,
                  borderColor: '#156ACF',
                }
              },
              label: {
                normal: {
                  show: false,
                  textStyle: {
                    fontSize: 30
                  }
                }
              }
            }, {
              name: 'main',
              type: 'pie',
              radius: ['64%', '68%'],
              label: {
                normal: {
                  show: false
                }
              },
              data: getData()
            }]
          };


          setTimeout(function() {
            chartInstance = echarts.init((element.find('div'))[0]);
            chartInstance.clear();
            chartInstance.resize();
            chartInstance.setOption(option);
          }, 600);

          scope.onResize = function() {
            if (chartInstance) {
              chartInstance.clear();
              chartInstance.resize();
              chartInstance.setOption(option);
            }
          }

          angular.element($window).bind('resize', function() {
              scope.onResize();
            })
            // })
        }
      }
    }
  ]);

  spot.directive('chartTargetRate', ['spotService', '$window',
    function(spotService, $window) {
      return {
        restrict: 'ACE',
        scope: {
          targetrate: '='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          var chartInstance = null;
          // if (!scope.targetrate || !scope.targetrate.url) {
          //   return;
          // }
          // spotService.getDetail(scope.targetrate.url, {
          //   picCode: scope.targetrate.picCode
          // }).then(function(result) {
          //   var opt = result.data;
          //   if (!opt || !opt.series) {
          //     return;
          //   }
          var colors = ['rgb(0,255,161)', 'rgb(245,225,67)', 'rgb(252,128,20)', 'rgba(0, 120, 215, 0.6)', 'rgba(0, 120, 215, 0.06)', 'rgb(3,204,215)'];
          var option = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              },
              formatter: "{a} <br/>{b} : {c}"
            },
            grid: {
              left: '9%',
              right: '8%',
              bottom: '8%',
              top: '8%',
              containLabel: true
            },
            xAxis: {
              type: 'value',
              name: '%',
              nameLocation: 'end',
              position: 'top',
              axisTick: {
                show: false
              },
              axisLabel: {
                show: false
              },
              axisLine: {
                show: false
              },
              splitLine: {
                show: false
              }
            },
            yAxis: {
              type: 'category',
              name: '',
              nameLocation: 'start',
              boundaryGap: true,
              axisTick: {
                show: false
              },
              axisLine: {
                show: true,
                lineStyle: {
                  color: 'rgba(0, 120, 255, 0.5)'
                }
              },
              axisLabel: {
                textStyle: {
                  color: 'rgb(246,246,246)',
                  fontSize: 14
                }
              },
              inverse: 'true', //排序
              data: [
                '与2016年目标比',
                '与 "十三五" 巴中目标比',
                '与 "十三五" 川东北目标比'
              ]
            },
            series: [{
              name: '同比增速',
              type: 'bar',
              barMaxWidth: '50%',
              label: {
                normal: {
                  show: true,
                  position: 'right',
                  formatter: '{c}%',
                  textStyle: {
                    color: 'rgb(246,246,246)',
                    fontSize: 14
                  }
                }
              },
              itemStyle: {
                normal: {
                  color: 'rgb(7,83,181)'
                }
              },
              data: [42, 36, 35]
            }]
          };

          setTimeout(function() {
            chartInstance = echarts.init((element.find('div'))[0]);
            chartInstance.clear();
            chartInstance.resize();
            chartInstance.setOption(option);
          }, 600);

          scope.onResize = function() {
            if (chartInstance) {
              chartInstance.clear();
              chartInstance.resize();
              chartInstance.setOption(option);
            }
          }

          angular.element($window).bind('resize', function() {
              scope.onResize();
            })
            // })
        }
      }
    }
  ]);

})();
