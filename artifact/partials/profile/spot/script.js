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
        if (num == 1) {
          $scope.rankdata = null;
          $scope.rankrate = null;
          $scope.targetcrt = null;
          $scope.targetgoal = null;
          $scope.targetrate = null;
        }
        if (num == 2) {
          $scope.month = 3;
          $scope.rankdata = {
            data: 2
          };
          $scope.rankrate = {
            data: 2
          };
          $scope.targetcrt = null;
          $scope.targetgoal = null;
          $scope.targetrate = null;
        }
        if (num == 3) {
          $scope.rankdata = null;
          $scope.rankrate = null;
          $scope.targetcrt = 0.8;
          $scope.targetgoal = 1.8;
          $scope.targetrate = 3;
        }
        $scope.isActive = num;


      }

      $scope.menuactive = 0;
      $scope.tabMenu = function(index) {
        $scope.menuactive = index;
      }

      $scope.byMonth = true;
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

      $scope.monthOptions = [{
        'id': 1,
        "name": "1月"
      }, {
        'id': 2,
        "name": "2月"
      }, {
        'id': 3,
        "name": "3月"
      }, {
        'id': 4,
        "name": "4月"
      }, {
        'id': 5,
        "name": "5月"
      }, {
        'id': 6,
        "name": "6月"
      }, {
        'id': 7,
        "name": "7月"
      }, {
        'id': 8,
        "name": "8月"
      }, {
        'id': 9,
        "name": "9月"
      }, {
        'id': 10,
        "name": "10月"
      }, {
        'id': 11,
        "name": "11月"
      }, {
        'id': 12,
        "name": "12月"
      }];

      $scope.quarter = 3;
      $scope.month = 1;

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
      spotService.getContent({
        menuId: menuId
      }).then(function(result) {
        vm.spotcontent = _.sortBy(result.data, ['picCode']);
        _.forEach(vm.spotcontent, function(item) {
          var chart = {};
          chart.opened = false;
          chart.url = item.url;
          chart.picCode = item.picCode;
          $scope.spotlist.push(chart);
          // TODO get first menu's submenus

        });

      });

      $scope.changed = function() {
        // TODO send http request for data of current menu width time parameters
        getTimeParams();
      }

      $scope.quarterChanged = function() {
        // TODO send http request for data of current menu with time parameters
        getTimeParams();
      }

      $scope.monthChanged = function() {
        // TODO send http request for data of current menu with time paramters
        getTimeParams();
      }

      function getTimeParams() {
        $scope.time_params = {};
        $scope.time_params.year = spotService.getDateFormat($scope.datepick.model, 'yyyy');
        if ($scope.byMonth) {
          $scope.time_params.month = $scope.month;
        } else {
          $scope.time_params.quarter = $scope.quarter;
        }
      }

      Date.prototype.Format = function(fmt) { //author: meizz
        var o = {
          "M+": this.getMonth() + 1, //月份
          "d+": this.getDate(), //日
          "h+": this.getHours(), //小时
          "m+": this.getMinutes(), //分
          "s+": this.getSeconds(), //秒
          "q+": Math.floor((this.getMonth() + 3) / 3), //季度
          "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt))
          fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
          if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
      }

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

  spot.directive('chartIncreaseTotal', ['spotService', '$window',
    function(spotService, $window) {
      return {
        restrict: 'ACE',
        scope: {
          increasetotal: '='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          var chartInstance = null;
          // if (!scope.increasetotal || !scope.increasetotal.url) {
          //   return;
          // }
          // spotService.getDetail(scope.increasetotal.url, {
          //   picCode: scope.increasetotal.picCode
          // }).then(function(result) {
          //   var opt = result.data;
          //   if (!opt || !opt.series) {
          //     return;
          //   }

          var resData = [{name:'去年',value:24},{name:'今年',value:36}];
          var data = [];
          _.forEach(resData,function(item) {
            var obj = {};
            obj.value = item.value;
            if(item.name == '今年') {
              obj.itemStyle = {
                normal: {
                  color: 'rgb(9,146,76)',
                  borderColor: 'rgb(7,218,63)',
                  borderWidth: 1
                }
              }
            } else{
              obj.itemStyle = {
                normal: {
                  color: 'rgb(7,83,181)',
                  borderColor: 'rgb(0,119,255)',
                  borderWidth: 1
                }
              }
            }
            data.push(obj);
          })

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
              bottom: '25%',
              top: '20%',
              containLabel: true
            },
            xAxis: {
              type: 'value',

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
              inverse: 'false', //排序
              data: [
                '去年',
                '今年'
              ]
            },
            series: [{
              name: '同比增速',
              type: 'bar',
              barMaxWidth: '40%',
              label: {
                normal: {
                  show: true,
                  position: 'right',
                  formatter: '{c}',
                  textStyle: {
                    color: 'rgb(246,246,246)',
                    fontSize: 14
                  }
                }
              },
              itemStyle: {
                normal: {
                  color: 'rgb(7,83,181)',
                  borderColor: 'rgb(0,119,255)',
                  borderWidth: 1
                }
              },
              data: data
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
          var resData = [{name:'全国',value:42},{name:'全省',value:36},{name:'巴中',value:35},{name:'上年同期',value:28}];
          var data = [];
          _.forEach(resData,function(item) {
            var obj = {};
            obj.value = item.value;
            if(item.name == '巴中') {
              obj.itemStyle = {
                normal: {
                  color: 'rgb(9,146,76)',
                  borderColor: 'rgb(7,218,63)',
                  borderWidth: 1
                }
              }
            } else{
              obj.itemStyle = {
                normal: {
                  color: 'rgb(7,83,181)',
                  borderColor: 'rgb(0,119,255)',
                  borderWidth: 1
                }
              }
            }
            data.push(obj);
          });

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
              inverse: 'false', //排序
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
              data: data
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
          var resData = [{name:'广元',value:842.65},{name:'广安',value:1036},{name:'南充',value:528},{name:'达州',value:505},{name:'巴中',value:395.5}];
          var data = [];

          _.forEach(resData,function(item) {
            var obj = {};
            obj.value = item.value;
            obj.name = item.name;
            if(item.name == '巴中') {
              obj.itemStyle = {
                normal: {
                  color: 'rgb(9,146,76)',
                  borderColor: 'rgb(7,218,63)',
                  borderWidth: 1
                }
              }
            } else{
              obj.itemStyle = {
                normal: {
                  color: 'rgb(7,83,181)',
                  borderColor: 'rgb(0,119,255)',
                  borderWidth: 1
                }
              }
            }
            data.push(obj);
          });
          data = _.sortBy(data, [function(o) { return -o.value; }]);
          var option = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              },
              formatter: "{a} <br/>{b} : {c}"
            },
            grid: {
              left: '10%',
              right: '12%',
              bottom: '12%',
              top: '12%',
              containLabel: true
            },
            yAxis: {
              type: 'value',
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
            xAxis: {
              type: '',
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
              data: _.map(data,'name')
            },
            series: [{
              name: '同比增速',
              type: 'bar',
              barMaxWidth: '30%',
              label: {
                normal: {
                  show: true,
                  position: 'top',
                  formatter: '{c}',
                  textStyle: {
                    color: 'rgb(246,246,246)',
                    fontSize: 14
                  }
                }
              },
              data: data
            }]
          };

          var optionMap = {
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
                  areaColor: 'rgba(0, 120, 255, 0.5)',
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
                  borderWidth: 1
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
            if (scope.rankdata.data && scope.rankdata.data != 'undefined') {
              chartInstance1.setOption(option);
            } else {
              chartInstance1.setOption(optionMap);
            }
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

  spot.directive('chartRankRate', ['spotService', '$window',
    function(spotService, $window) {
      return {
        restrict: 'ACE',
        scope: {
          rankrate: '='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          var chartInstance1 = null;
          // if (!scope.rankrate || !scope.rankrate.url) {
          //   return;
          // }
          // spotService.getDetail(scope.rankrate.url, {
          //   picCode: scope.rankrate.picCode
          // }).then(function(result) {
          //   var opt = result.data;
          //   if (!opt || !opt.series) {
          //     return;
          //   }
          var resData = [{name:'广元',value:1142.65},{name:'广安',value:1036},{name:'南充',value:528},{name:'达州',value:505},{name:'巴中',value:395.5}];
          var data = [];
          _.forEach(resData,function(item) {
            var obj = {};
            obj.value = item.value;
            obj.name = item.name;
            if(item.name == '巴中') {
              obj.itemStyle = {
                normal: {
                  color: 'rgb(9,146,76)',
                  borderColor: 'rgb(7,218,63)',
                  borderWidth: 1
                }
              }
            } else{
              obj.itemStyle = {
                normal: {
                  color: 'rgb(7,83,181)',
                  borderColor: 'rgb(0,119,255)',
                  borderWidth: 1
                }
              }
            }
            data.push(obj);
          });
          data = _.sortBy(data, [function(o) { return -o.value; }]);

          var option = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              },
              formatter: "{a} <br/>{b} : {c}"
            },
            grid: {
              left: '12%',
              right: '12%',
              bottom: '12%',
              top: '12%',
              containLabel: true
            },
            yAxis: {
              type: 'value',
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
            xAxis: {
              type: '',
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
              data: _.map(data,'name')
            },
            series: [{
              name: '同比增速',
              type: 'bar',
              barMaxWidth: '30%',
              label: {
                normal: {
                  show: true,
                  position: 'top',
                  formatter: '{c}%',
                  textStyle: {
                    color: 'rgb(246,246,246)',
                    fontSize: 14
                  }
                }
              },
              data:data
            }]
          };

          var optionMap = {
            // color:['rgb(195,211,234)','rgb(2,230,239)'],
            legend: {
              orient: 'vertical',
              left: 'left'
            },
            series: [{
              name: '川东北经济区排位',
              type: 'map',
              map: 'bz_single',
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
                  areaColor: 'rgba(0, 120, 255, 0.5)',
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
                  borderWidth: 1
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
            if (scope.rankrate.data) {
              chartInstance1.setOption(option);
            } else {
              chartInstance1.setOption(optionMap);
            }
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
          var percent = scope.targetgoaldata;



          function getData() {
            return [{
              value: percent - Math.floor(percent),
              itemStyle: {
                normal: {
                  color: '#f2c967',
                  shadowBlur: 10,
                  shadowColor: '#f2c967'
                }
              }
            }, {
              value: 1 - (percent - Math.floor(percent)),
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
              data: [percent],
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
          if (percent > 1) {
            option.series[1] = {
              name: '超额',
              type: 'pie',
              radius: ['64%', '68%'],
              label: {
                normal: {
                  show: false
                }
              },
              data: getData()
            }
          }


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
          targetratedata: '='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          var chartInstance = null;
          // if (!scope.targetratedata || !scope.targetratedata.url) {
          //   return;
          // }
          // spotService.getDetail(scope.targetratedata.url, {
          //   picCode: scope.targetratedata.picCode
          // }).then(function(result) {
          //   var opt = result.data;
          //   if (!opt || !opt.series) {
          //     return;
          //   }

          var resData = [{name:'"十三五"目标',value:1142.65},{name:'川东北"十三五"目标',value:1036},{name:'巴中',value:395.5},{name:'2015年目标',value:505}];
          var data = [];
          _.forEach(resData,function(item) {
            var obj = {};
            obj.value = item.value;
            obj.name = item.name;
            if(item.name == '巴中') {
              obj.itemStyle = {
                normal: {
                  color: 'rgb(155,157,82)',
                  borderColor: 'rgb(245,222,68)',
                  borderWidth: 1
                }
              }
            } else{
              obj.itemStyle = {
                normal: {
                  color: 'rgb(7,83,181)',
                  borderColor: 'rgb(0,119,255)',
                  borderWidth: 1
                }
              }
            }
            data.push(obj);
          });

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
              data: _.map(data,'name')
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
              data: data
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
