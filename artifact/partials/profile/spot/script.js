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

      $scope.showChart = function(num, id) {
        $scope.isActive = num;
        var params = {};
        params.menuId = id;
        console.log($scope.groupOptions);
        if ($scope.group) {
          params.groupId = $scope.group.groupId ? $scope.group.groupId : $scope.group // 解决select option.id 为undefined与as in 的冲突
        }
        spotService.getContent(params).then(function(data) {
          $scope.commondata = {};

          if (num == 1) {
            $scope.increasedata = _.sortBy(data.data, ['picCode']);
            $scope.rankdata = null;
            $scope.targetdata = null;
          }
          if (num == 2) {
            $scope.rankdata = _.sortBy(data.data, ['picCode']);
            $scope.increasedata = null;
            $scope.targetdata = null;
          }
          if (num == 3) {
            $scope.targetdata = _.sortBy(data.data, ['picCode']);
            $scope.rankdata = null;
            $scope.increasedata = null;
          }
        });
      }

      $scope.menuactive = 0;
      $scope.tabMenu = function(index, id, type) {
        $scope.menuactive = index;
        $scope.isActive = 1;
        if (type == 6) { // 包含其他分类指标
          $scope.hasGroup = true;
          spotService.getGroups({
            menuId: id
          }).then(function(result) {
            $scope.groupOptions = _.sortBy(result.data, ['groupId']);
            $scope.group = $scope.groupOptions[0];
            spotService.getMenus({
              parentId: id
            }).then(function(res) {
              $scope.submenus = _.sortBy(res.data, ['id']);
              spotService.getContent({
                menuId: $scope.submenus[0].id,
                groupId: $scope.groupOptions[0].groupId
              }).then(function(data) {
                $scope.commondata = {};
                $scope.increasedata = _.sortBy(data.data, ['picCode']);
              })
            })
          })
        } else if (type == 5) { // 物价，不包含三级菜单，直接请求数据
          $scope.hasGroup = false;
          $scope.submenus = null;
          spotService.getContent({
            menuId: id
          }).then(function(data) {
            $scope.commondata = {};
            $scope.increasedata = _.sortBy(data.data, ['picCode']);
          })
        } else {
          $scope.hasGroup = false;
          $scope.group = null;
          spotService.getMenus({
            parentId: id
          }).then(function(res) {
            $scope.submenus = _.sortBy(res.data, ['id']);
            spotService.getContent({
              menuId: $scope.submenus[0].id
            }).then(function(data) {
              $scope.commondata = {};
              $scope.increasedata = _.sortBy(data.data, ['picCode']);
            })
          })
        }

      }



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
      $scope.commondata = {};


      $scope.dateOptions = {};
      $scope.dateOptions.format = 'yyyy';
      $scope.dateOptions.minMode = 'year';
      $scope.dateOptions.datepickerMode = 'year';
      $scope.altInputFormats = ['M!/d!/yyyy'];

      $scope.commondata.byMonth = false;

      $scope.open = function() {
        $scope.dateOptions.opened = true;
      };

      $scope.spotlist = [];
      var menuId = $stateParams.proid;
      $rootScope.currentMenu = menuId;
      spotService.getMenus({
        parentId: menuId
      }).then(function(result) {
        $scope.menus = result.data;
        spotService.getMenus({
          parentId: $scope.menus[0].id
        }).then(function(res) {
          $scope.submenus = _.sortBy(res.data, ['id']);
          spotService.getContent({
            menuId: $scope.submenus[0].id
          }).then(function(data) {
            $scope.increasedata = _.sortBy(data.data, ['picCode']);
          })
        })

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

      $scope.groupChanged = function() {
        $scope.showChart($scope.isActive, $scope.submenus[$scope.isActive - 1].id);
      }

      function getTimeParams() {
        $scope.time_params = {};
        $scope.time_params.year = spotService.getDateFormat($scope.commondata.model, 'yyyy');
        if ($scope.commondata.byMonth) {
          $scope.time_params.month = $scope.commondata.month;
        } else {
          $scope.time_params.quarter = $scope.commondata.quarter;
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
        getDateFormat: getDateFormat,
        getGroups: getGroups
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

      function getGroups(params) {
        return $http.get(
          URL + '/main/showGroup', {
            params: params
          }
        )
      }

      function getDateFormat(parseDate, format) {
        var date = angular.copy(parseDate);
        if (date && angular.isDate(date) && !isNaN(date.getTime())) {
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
          increasetotal: '=',
          commoninfo: '='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          var chartInstance = null;
          if (!scope.increasetotal || !scope.increasetotal.url) {
            return;
          }

          scope.$watch('increasetotal', function(newValue, oldValue) {
            if (newValue === oldValue || !newValue || !oldValue || newValue.active) {
              return;
            }
            redraw();
          }, true);

          scope.$watch('commoninfo.model', function(newValue, oldValue) {
            if (newValue === oldValue || !newValue || !oldValue) {
              return;
            }
            redraw();
          }, true);
          scope.$watch('commoninfo.quarter', function(newValue, oldValue) {
            if (newValue === oldValue || !newValue || !oldValue) {
              return;
            }
            redraw();
          }, true);
          scope.$watch('commoninfo.month', function(newValue, oldValue) {
            if (newValue === oldValue || !newValue || !oldValue) {
              return;
            }
            redraw();
          }, true);

          // init
          redraw();

          function redraw() {
            //  set time params;
            var timeParam = null;
            if (scope.commoninfo && scope.commoninfo.model) {
              timeParam = angular.copy(scope.commoninfo.model);
              if (scope.commoninfo.time_scope == 'quarter') {
                timeParam.setMonth(scope.commoninfo.quarter - 1);
              } else if (scope.commoninfo.time_scope == 'month') {
                timeParam.setMonth(scope.commoninfo.month - 1);
              }
            }
            scope.commoninfo.promiseIncrease = spotService.getDetail(scope.increasetotal.url, {
              queryTime: spotService.getDateFormat(timeParam, 'yyyy-MM'),
              picCode: scope.increasetotal.picCode
            }).then(function(result) {
              var opt = result.data;
              if (!opt || !opt.series) {
                return;
              }
              scope.commoninfo.dep_name = opt.dep_name;
              scope.increasetotal.active = true; // 为了再次点击菜单时能触发increasetotal change事件
              if (opt.time_scope == 'quarter') {
                scope.commoninfo.byMonth = false;
              } else {
                scope.commoninfo.byMonth = true;
              }
              if (!scope.commoninfo.model && opt.init_query_time != '') {
                scope.commoninfo.time_scope = opt.time_scope;
                scope.commoninfo.model = new Date(opt.init_query_time);
                var quarterMonth = opt.init_query_time.substring(opt.init_query_time.indexOf('-') + 1);
                if (opt.time_scope == 'quarter') {
                  scope.commoninfo.byMonth = false;
                  scope.commoninfo.quarter = Number(quarterMonth);
                } else {
                  scope.commoninfo.byMonth = true;
                  scope.commoninfo.month = Number(quarterMonth);
                }
              }
              var resData = opt.series[0].data;
              var data = [];
              var hasData = false;
              _.forEach(resData, function(item) {
                var obj = {};
                obj.value = item.value;
                if (item.highLight == '1') {
                  obj.itemStyle = {
                    normal: {
                      color: 'rgb(9,146,76)',
                      borderColor: 'rgb(7,218,63)',
                      borderWidth: 1
                    }
                  }
                  if (item.value != '') {
                    hasData = true;
                  }
                  scope.commoninfo.totalAmount = item.value;

                } else {
                  obj.itemStyle = {
                    normal: {
                      color: 'rgb(7,83,181)',
                      borderColor: 'rgb(0,119,255)',
                      borderWidth: 1
                    }
                  }
                  scope.commoninfo.totalLastAmount = item.value;
                }
                scope.commoninfo.title = opt.title;
                scope.commoninfo.totalTitle = '总量';
                scope.commoninfo.totalUnit = opt.y_name[0];
                scope.commoninfo.floatNum = (scope.commoninfo.totalAmount - scope.commoninfo.totalLastAmount).toFixed(2);
                if (scope.commoninfo.floatNum >= 0) {
                  scope.commoninfo.floatDesc = '增加';
                } else {
                  scope.commoninfo.floatDesc = '减少';
                }
                data.push(obj);
              });
              scope.commoninfo.othertotal = _.filter(resData, function(o) {
                return o.highLight != '1';
              })
              var option = {
                tooltip: {
                  trigger: 'axis',
                  axisPointer: {
                    type: 'shadow'
                  },
                  formatter: "{a} <br/>{b} : {c}" + opt.y_name[0]
                },
                grid: {
                  left: '9%',
                  right: '19%',
                  bottom: '8%',
                  top: '0',
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
                    interval: 0,
                    textStyle: {
                      color: 'rgb(246,246,246)',
                      fontSize: 14
                    }
                  },
                  inverse: 'false', //排序
                  data: opt.x_data
                },
                series: [{
                  name: opt.series[0].name,
                  type: 'bar',
                  barMaxWidth: (data.length < 3) ? '30%' : '50%',
                  label: {
                    normal: {
                      show: true,
                      position: 'right',
                      formatter: '{c}' + opt.y_name[0],
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
                chartInstance = echarts.init((element.find('div'))[0]);
                chartInstance.clear();
                chartInstance.resize();
                if (hasData) {
                  chartInstance.setOption(option);
                } else {
                  chartInstance.setOption(optionMap);
                }
              }, 600);

              scope.onResize = function() {
                if (chartInstance) {
                  chartInstance.clear();
                  chartInstance.resize();
                  if (hasData) {
                    chartInstance.setOption(option);
                  } else {
                    chartInstance.setOption(optionMap);
                  }
                }
              }

              angular.element($window).bind('resize', function() {
                scope.onResize();
              })
            })
          }

        }
      }
    }
  ]);

  spot.directive('chartIncreaseRate', ['spotService', '$window',
    function(spotService, $window) {
      return {
        restrict: 'ACE',
        scope: {
          increaserate: '=',
          commoninfo: '='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          var chartInstance = null;
          if (!scope.increaserate || !scope.increaserate.url) {
            return;
          }

          scope.$watch('increaserate', function(newValue, oldValue) {
            if (newValue === oldValue || !newValue || !oldValue || newValue.active) {
              return;
            }
            redraw();
          }, true);

          scope.$watch('commoninfo.model', function(newValue, oldValue) {
            if (newValue === oldValue || !newValue || !oldValue) {
              return;
            }
            redraw();
          }, true);
          scope.$watch('commoninfo.quarter', function(newValue, oldValue) {
            if (newValue === oldValue || !newValue || !oldValue) {
              return;
            }
            redraw();
          }, true);
          scope.$watch('commoninfo.month', function(newValue, oldValue) {
            if (newValue === oldValue || !newValue || !oldValue) {
              return;
            }
            redraw();
          }, true);

          // init
          redraw();

          function redraw() {
            scope.commoninfo.promiseIncrease.then(function() {
              var timeParam = null;
              if (scope.commoninfo && scope.commoninfo.model) {
                timeParam = angular.copy(scope.commoninfo.model);
                if (scope.commoninfo.time_scope == 'quarter') {
                  timeParam.setMonth(scope.commoninfo.quarter - 1);
                } else if (scope.commoninfo.time_scope == 'month') {
                  timeParam.setMonth(scope.commoninfo.month - 1);
                }
              }
              spotService.getDetail(scope.increaserate.url, {
                queryTime: spotService.getDateFormat(timeParam, 'yyyy-MM'),
                picCode: scope.increaserate.picCode
              }).then(function(result) {
                var opt = result.data;
                if (!opt || !opt.series) {
                  return;
                }
                scope.commoninfo.dep_name = opt.dep_name;
                scope.increaserate.active = true; // 为了再次点击菜单时能触发increaserate change事件
                if (opt.time_scope == 'quarter') {
                  scope.commoninfo.byMonth = false;
                } else {
                  scope.commoninfo.byMonth = true;
                }
                if (!scope.commoninfo.model && opt.init_query_time != '') {
                  scope.commoninfo.time_scope = opt.time_scope;
                  scope.commoninfo.model = new Date(opt.init_query_time);
                  var quarterMonth = opt.init_query_time.substring(opt.init_query_time.indexOf('-') + 1);
                  if (opt.time_scope == 'quarter') {
                    scope.commoninfo.byMonth = false;
                    scope.commoninfo.quarter = Number(quarterMonth);
                  } else {
                    scope.commoninfo.byMonth = true;
                    scope.commoninfo.month = Number(quarterMonth);
                  }
                }
                scope.commoninfo.title = opt.title;
                var resData = opt.series[0].data;
                var data = [];
                var rateItems = '';
                var hasData = false;
                _.forEach(resData, function(item) {
                  var obj = {};
                  if (item.value != '') {
                    item.value = parseFloat(item.value);
                  }
                  obj.value = item.value;
                  if (item.highLight == '1') {
                    obj.itemStyle = {
                      normal: {
                        color: 'rgb(9,146,76)',
                        borderColor: 'rgb(7,218,63)',
                        borderWidth: 1
                      }
                    }
                    if (item.value != '') {
                      hasData = true;
                    }
                    scope.commoninfo.rateTotal = item.value;
                    scope.commoninfo.rateUnit = opt.y_name[0];
                  } else {
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
                scope.commoninfo.otherrate = _.filter(resData, function(o) {
                  return o.highLight != '1';
                })
                var option = {
                  tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                      type: 'shadow'
                    },
                    formatter: "{a} <br/>{b} : {c}" + opt.y_name[0]
                  },
                  grid: {
                    left: '9%',
                    right: '15%',
                    bottom: '8%',
                    top: '0',
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
                      interval: 0,
                      textStyle: {
                        color: 'rgb(246,246,246)',
                        fontSize: 14
                      }
                    },
                    inverse: 'false', //排序
                    data: opt.x_data
                  },
                  series: [{
                    name: opt.series[0].name,
                    type: 'bar',
                    barMaxWidth: (data.length < 3) ? '30%' : '50%',
                    label: {
                      normal: {
                        show: true,
                        position: 'right',
                        formatter: '{c}' + opt.y_name[0],
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
                  chartInstance = echarts.init((element.find('div'))[0]);
                  chartInstance.clear();
                  chartInstance.resize();
                  if (hasData) {
                    chartInstance.setOption(option);
                  } else {
                    chartInstance.setOption(optionMap);
                  }
                }, 600);

                scope.onResize = function() {
                  if (chartInstance) {
                    chartInstance.clear();
                    chartInstance.resize();
                    if (hasData) {
                      chartInstance.setOption(option);
                    } else {
                      chartInstance.setOption(optionMap);
                    }
                  }
                }

                angular.element($window).bind('resize', function() {
                  scope.onResize();
                })
              })
            })


          }

        }
      }
    }
  ]);

  spot.directive('chartRankTotal', ['spotService', '$window',
    function(spotService, $window) {
      return {
        restrict: 'ACE',
        scope: {
          rankdata: '=',
          commoninfo: '='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          var chartInstance1 = null;
          if (!scope.rankdata || !scope.rankdata.url) {
            return;
          }

          scope.$watch('rankdata', function(newValue, oldValue) {
            if (newValue === oldValue || !newValue || !oldValue || newValue.active) {
              return;
            }
            redraw();
          });

          scope.$watch('commoninfo.model', function(newValue, oldValue) {
            if (newValue === oldValue || !newValue || !oldValue) {
              return;
            }
            redraw();
          }, true);
          scope.$watch('commoninfo.quarter', function(newValue, oldValue) {
            if (newValue === oldValue || !newValue || !oldValue) {
              return;
            }
            redraw();
          }, true);
          scope.$watch('commoninfo.month', function(newValue, oldValue) {
            if (newValue === oldValue || !newValue || !oldValue) {
              return;
            }
            redraw();
          }, true);

          // init
          redraw();

          function redraw() {
            //  set time params;
            var timeParam = null;
            if (scope.commoninfo && scope.commoninfo.model) {
              timeParam = angular.copy(scope.commoninfo.model);
              if (scope.commoninfo.time_scope == 'quarter') {
                timeParam.setMonth(scope.commoninfo.quarter - 1);
              } else if (scope.commoninfo.time_scope == 'month') {
                timeParam.setMonth(scope.commoninfo.month - 1);
              }
            }

            scope.commoninfo.promiseRank = spotService.getDetail(scope.rankdata.url, {
              queryTime: spotService.getDateFormat(timeParam, 'yyyy-MM'),
              picCode: scope.rankdata.picCode
            }).then(function(result) {
              var opt = result.data;
              if (!opt || !opt.series) {
                return;
              }
              scope.commoninfo.dep_name = opt.dep_name;
              scope.rankdata.active = true; // 为了再次点击菜单时能触发 rankdata change事件
              if (!scope.commoninfo.model && opt.init_query_time != '') {
                scope.commoninfo.time_scope = opt.time_scope;
                scope.commoninfo.byMonth = true;
                scope.commoninfo.model = new Date(opt.init_query_time);
                var quarterMonth = opt.init_query_time.substring(opt.init_query_time.indexOf('-') + 1);
                if (opt.time_scope == 'quarter') {
                  scope.commoninfo.quarter = Number(quarterMonth);
                  scope.commoninfo.byMonth = false;
                } else {
                  scope.commoninfo.month = Number(quarterMonth);
                  scope.commoninfo.byMonth = true;
                }
              }
              // 查询排位信息
              if (opt.table_type == 'different' && opt.table_url != '') {
                spotService.getDetail(opt.table_url, {
                  queryTime: spotService.getDateFormat(timeParam, 'yyyy-MM'),
                  picCode: scope.rankdata.picCode
                }).then(function(result) {
                  scope.commoninfo.rankdetail = result.data;
                  _.forEach(scope.commoninfo.rankdetail, function(data) {
                    data.floatValue = parseInt(data.floatValue);
                    data.value = parseInt(data.value);
                  })
                })
              }
              var resData = opt.series[0].data;
              var data = [];
              resData = _.sortBy(resData, [function(o) {
                return -o.value;
              }]);
              var hasData = false;
              _.forEach(resData, function(item, index) {
                var obj = {};
                obj.value = item.value;
                obj.name = item.name;
                if (item.highLight == '1') {
                  obj.itemStyle = {
                    normal: {
                      color: 'rgb(9,146,76)',
                      borderColor: 'rgb(7,218,63)',
                      borderWidth: 1
                    }
                  }
                  if (item.value != '') {
                    hasData = true;
                  }
                  scope.commoninfo.totalAmount = item.value;
                  scope.commoninfo.rankNum = index + 1;
                } else {
                  obj.itemStyle = {
                    normal: {
                      color: 'rgb(7,83,181)',
                      borderColor: 'rgb(0,119,255)',
                      borderWidth: 1
                    }
                  }
                }
                scope.commoninfo.title = opt.title;
                scope.commoninfo.totalTitle = '总量';
                scope.commoninfo.totalUnit = opt.y_name[0];
                data.push(obj);
              });
              var option = {
                tooltip: {
                  trigger: 'axis',
                  axisPointer: {
                    type: 'shadow'
                  },
                  formatter: "{a} <br/>{b} : {c}" + opt.y_name[0]
                },
                grid: {
                  left: '10%',
                  right: '12%',
                  bottom: '12%',
                  top: '16%',
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
                    interval: 0,
                    textStyle: {
                      color: 'rgb(246,246,246)',
                      fontSize: 14
                    }
                  },
                  data: _.map(data, 'name')
                },
                series: [{
                  name: opt.series[0].name,
                  type: 'bar',
                  barMaxWidth: (data.length < 3) ? '20%' : '30%',
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
                if (hasData && scope.rankdata.picCode != '10721' && scope.rankdata.picCode != '10723') { // 10721为居民收支
                  chartInstance1.setOption(option);
                } else {
                  chartInstance1.setOption(optionMap);
                }
              }, 600);

              scope.onResize2 = function() {
                if (chartInstance1) {
                  chartInstance1.clear();
                  chartInstance1.resize();
                  if (hasData && scope.rankdata.picCode != '10721' && scope.rankdata.picCode != '10723') { // 10721为居民收支
                    chartInstance1.setOption(option);
                  } else {
                    chartInstance1.setOption(optionMap);
                  }
                }
              }

              angular.element($window).bind('resize', function() {
                scope.onResize2();
              })
            })
          }

        }
      }
    }
  ]);

  spot.directive('chartRankRate', ['spotService', '$window',
    function(spotService, $window) {
      return {
        restrict: 'ACE',
        scope: {
          rankrate: '=',
          commoninfo: '='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          var chartInstance1 = null;
          if (!scope.rankrate || !scope.rankrate.url) {
            return;
          }
          scope.$watch('rankrate', function(newValue, oldValue) {
            if (newValue === oldValue || !newValue || !oldValue || newValue.active) {
              return;
            }
            redraw();
          });

          scope.$watch('commoninfo.model', function(newValue, oldValue) {
            if (newValue === oldValue || !newValue || !oldValue) {
              return;
            }
            redraw();
          }, true);
          scope.$watch('commoninfo.quarter', function(newValue, oldValue) {
            if (newValue === oldValue || !newValue || !oldValue) {
              return;
            }
            redraw();
          }, true);
          scope.$watch('commoninfo.month', function(newValue, oldValue) {
            if (newValue === oldValue || !newValue || !oldValue) {
              return;
            }
            redraw();
          }, true);

          // init
          redraw();

          function redraw() {
            scope.commoninfo.promiseRank.then(function() {
              //  set time params;
              var timeParam = null;
              if (scope.commoninfo && scope.commoninfo.model) {
                timeParam = angular.copy(scope.commoninfo.model);
                if (scope.commoninfo.time_scope == 'quarter') {
                  timeParam.setMonth(scope.commoninfo.quarter - 1);
                } else if (scope.commoninfo.time_scope == 'month') {
                  timeParam.setMonth(scope.commoninfo.month - 1);
                }
              }
              spotService.getDetail(scope.rankrate.url, {
                queryTime: spotService.getDateFormat(timeParam, 'yyyy-MM'),
                picCode: scope.rankrate.picCode
              }).then(function(result) {
                var opt = result.data;
                if (!opt || !opt.series) {
                  return;
                }
                scope.commoninfo.dep_name = opt.dep_name;
                scope.rankrate.active = true; // 为了再次点击菜单时能触发 rankrate change事件
                if (!scope.commoninfo.model && opt.init_query_time != '') {
                  scope.commoninfo.time_scope = opt.time_scope;
                  scope.commoninfo.byMonth = true;
                  scope.commoninfo.model = new Date(opt.init_query_time);
                  var quarterMonth = opt.init_query_time.substring(opt.init_query_time.indexOf('-') + 1);
                  if (opt.time_scope == 'quarter') {
                    scope.commoninfo.quarter = Number(quarterMonth);
                    scope.commoninfo.byMonth = false;
                  } else {
                    scope.commoninfo.month = Number(quarterMonth);
                    scope.commoninfo.byMonth = true;
                  }
                }
                // 查询排位信息
                if (opt.table_type == 'different' && opt.table_url != '') {
                  spotService.getDetail(opt.table_url, {
                    queryTime: spotService.getDateFormat(timeParam, 'yyyy-MM'),
                    picCode: scope.rankrate.picCode
                  }).then(function(result) {
                    scope.commoninfo.rankratedetail = result.data;
                    _.forEach(scope.commoninfo.rankratedetail, function(data) {
                      data.floatValue = parseInt(data.floatValue);
                      data.value = parseInt(data.value);
                    })
                  })
                }

                scope.commoninfo.title = opt.title;
                var resData = opt.series[0].data;
                resData = _.sortBy(resData, [function(o) {
                  return -o.value;
                }]);
                var data = [];
                var hasData = false;
                _.forEach(resData, function(item) {
                  var obj = {};
                  obj.value = item.value;
                  obj.name = item.name;
                  if (item.highLight == '1') {
                    obj.itemStyle = {
                      normal: {
                        color: 'rgb(9,146,76)',
                        borderColor: 'rgb(7,218,63)',
                        borderWidth: 1
                      }
                    }
                    if (item.value != '') {
                      hasData = true;
                    }
                    scope.commoninfo.rateTotal = item.value;
                    scope.commoninfo.rateUnit = opt.y_name[0];
                  } else {
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
                    formatter: "{a} <br/>{b} : {c}" + opt.y_name[0]
                  },
                  grid: {
                    left: '12%',
                    right: '12%',
                    bottom: '12%',
                    top: '16%',
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
                      interval: 0,
                      textStyle: {
                        color: 'rgb(246,246,246)',
                        fontSize: 14
                      }
                    },
                    data: _.map(data, 'name')
                  },
                  series: [{
                    name: opt.series[0].name,
                    type: 'bar',
                    barMaxWidth: (data.length < 3) ? '20%' : '30%',
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
                  if (hasData && scope.rankrate.picCode != '10722' && scope.rankrate.picCode != '10724') { // 10721为居民收支
                    chartInstance1.setOption(option);
                  } else {
                    chartInstance1.setOption(optionMap);
                  }
                }, 600);

                scope.onResize2 = function() {
                  if (chartInstance1) {
                    chartInstance1.clear();
                    chartInstance1.resize();
                    if (hasData && scope.rankrate.picCode != '10722' && scope.rankrate.picCode != '10724') { // 10721为居民收支
                      chartInstance1.setOption(option);
                    } else {
                      chartInstance1.setOption(optionMap);
                    }
                  }
                }

                angular.element($window).bind('resize', function() {
                  scope.onResize2();
                })
              })
            })
          }

        }
      }
    }
  ]);


  spot.directive('chartTargetGoal', ['spotService', '$window',
    function(spotService, $window) {
      return {
        restrict: 'ACE',
        scope: {
          targetgoaldata: '=',
          commoninfo: '='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          var chartInstance = null;
          if (!scope.targetgoaldata || !scope.targetgoaldata.url) {
            return;
          }

          scope.$watch('targetgoaldata', function(newValue, oldValue) {
            if (newValue === oldValue || !newValue || !oldValue || newValue.active) {
              return;
            }
            redraw();
          });

          scope.$watch('commoninfo.model', function(newValue, oldValue) {
            if (newValue === oldValue || !newValue || !oldValue) {
              return;
            }
            redraw();
          }, true);
          scope.$watch('commoninfo.quarter', function(newValue, oldValue) {
            if (newValue === oldValue || !newValue || !oldValue) {
              return;
            }
            redraw();
          }, true);
          scope.$watch('commoninfo.month', function(newValue, oldValue) {
            if (newValue === oldValue || !newValue || !oldValue) {
              return;
            }
            redraw();
          }, true);
          // init
          redraw();

          function redraw() {
            //  set time params;
            var timeParam = null;
            if (scope.commoninfo && scope.commoninfo.model) {
              timeParam = angular.copy(scope.commoninfo.model);
              if (scope.commoninfo.time_scope == 'quarter') {
                timeParam.setMonth(scope.commoninfo.quarter - 1);
              } else if (scope.commoninfo.time_scope == 'month') {
                timeParam.setMonth(scope.commoninfo.month - 1);
              }
            }

            scope.commoninfo.promiseTarget = spotService.getDetail(scope.targetgoaldata.url, {
              queryTime: spotService.getDateFormat(timeParam, 'yyyy-MM'),
              picCode: scope.targetgoaldata.picCode
            }).then(function(result) {
              var opt = result.data;
              if (!opt || !opt.series) {
                return;
              }
              scope.commoninfo.dep_name = opt.dep_name;
              scope.targetgoaldata.active = true; // 为了再次点击菜单时能触发 targetgoaldata change事件
              if (!scope.commoninfo.model && opt.init_query_time != '') {
                scope.commoninfo.time_scope = opt.time_scope;
                scope.commoninfo.byMonth = true;
                scope.commoninfo.model = new Date(opt.init_query_time);
                var quarterMonth = opt.init_query_time.substring(opt.init_query_time.indexOf('-') + 1);
                if (opt.time_scope == 'quarter') {
                  scope.commoninfo.quarter = Number(quarterMonth);
                  scope.commoninfo.byMonth = false;
                } else {
                  scope.commoninfo.month = Number(quarterMonth);
                  scope.commoninfo.byMonth = true;
                }
              }
              var resData = opt.series;
              var data = [];
              var hasData = false;
              _.forEach(resData, function(item) {
                if (item.name == '今年目标') {
                  _.forEach(item.data, function(data) {
                    if (data.highLight == '1') {
                      scope.commoninfo.totalTitle = '总量';
                      scope.commoninfo.totalAmount = data.value;
                      scope.commoninfo.totalUnit = data.unit;
                      if (data.value != '') {
                        hasData = true;
                      }
                    }
                    if (data.name == '查询时间') {
                      scope.commoninfo.targetThisYear = data.value;
                    }
                    if (data.name == '目标') {
                      scope.commoninfo.targetThisValue = data.value;
                      scope.commoninfo.targetThisUnit = data.unit; // 目标单位
                    }
                  })
                } else {
                  _.forEach(item.data, function(data) {
                    if (data.name == '查询时间') {
                      scope.commoninfo.targetFutureYear = data.value;
                    }
                    if (data.name == '五年目标') {
                      scope.commoninfo.targetFutureValue = data.value;
                      scope.commoninfo.targetFutureUnit = data.unit; // 目标单位
                    }
                  })
                }
              })

              var percent = 0;
              if (scope.commoninfo.totalAmount != '' && scope.commoninfo.targetThisValue != '') {
                percent = (parseFloat(scope.commoninfo.totalAmount) / parseFloat(scope.commoninfo.targetThisValue)).toFixed(3);
              }
              scope.commoninfo.percentThisYear = (percent * 100).toFixed(1);

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
                  text: scope.commoninfo.targetThisYear + '年：' + scope.commoninfo.targetThisValue + scope.commoninfo.targetThisUnit,
                  left: 'center',
                  top: 'bottom',
                  textStyle: {
                    color: 'rgb(240,240,240)',
                    fontWeight: 'normal',
                    fontSize: 14
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
                      },
                      formatter: function(param) {
                        return scope.commoninfo.percentThisYear + '%';
                      },
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
                chartInstance = echarts.init((element.find('div'))[0]);
                chartInstance.clear();
                chartInstance.resize();
                if (hasData) {
                  chartInstance.setOption(option);
                } else {
                  chartInstance.setOption(optionMap);
                }
              }, 600);

              scope.onResize = function() {
                if (chartInstance) {
                  chartInstance.clear();
                  chartInstance.resize();
                  if (hasData) {
                    chartInstance.setOption(option);
                  } else {
                    chartInstance.setOption(optionMap);
                  }

                }
              }

              angular.element($window).bind('resize', function() {
                scope.onResize();
              })
            })
          }

        }
      }
    }
  ]);

  spot.directive('chartTargetGoalFuture', ['spotService', '$window',
    function(spotService, $window) {
      return {
        restrict: 'ACE',
        scope: {
          targetgoaldata: '=',
          commoninfo: '='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          var chartInstance = null;
          if (!scope.targetgoaldata || !scope.targetgoaldata.url) {
            return;
          }

          scope.$watch('targetgoaldata', function(newValue, oldValue) {
            if (newValue === oldValue || !newValue || !oldValue || newValue.active) {
              return;
            }
            redraw();
          });

          scope.$watch('commoninfo.model', function(newValue, oldValue) {
            if (newValue === oldValue || !newValue || !oldValue) {
              return;
            }
            redraw();
          }, true);
          scope.$watch('commoninfo.quarter', function(newValue, oldValue) {
            if (newValue === oldValue || !newValue || !oldValue) {
              return;
            }
            redraw();
          }, true);
          scope.$watch('commoninfo.month', function(newValue, oldValue) {
            if (newValue === oldValue || !newValue || !oldValue) {
              return;
            }
            redraw();
          }, true);
          // init
          redraw();

          function redraw() {
            //  set time params;
            var timeParam = null;
            if (scope.commoninfo && scope.commoninfo.model) {
              timeParam = angular.copy(scope.commoninfo.model);
              if (scope.commoninfo.time_scope == 'quarter') {
                timeParam.setMonth(scope.commoninfo.quarter - 1);
              } else if (scope.commoninfo.time_scope == 'month') {
                timeParam.setMonth(scope.commoninfo.month - 1);
              }
            }
            scope.commoninfo.promiseTarget = spotService.getDetail(scope.targetgoaldata.url, {
              queryTime: spotService.getDateFormat(timeParam, 'yyyy-MM'),
              picCode: scope.targetgoaldata.picCode
            }).then(function(result) {
              var opt = result.data;
              if (!opt || !opt.series) {
                return;
              }
              scope.commoninfo.dep_name = opt.dep_name;
              scope.targetgoaldata.active = true; // 为了再次点击菜单时能触发 targetgoaldata change事件
              if (!scope.commoninfo.model && opt.init_query_time != '') {
                scope.commoninfo.time_scope = opt.time_scope;
                scope.commoninfo.byMonth = true;
                scope.commoninfo.model = new Date(opt.init_query_time);
                var quarterMonth = opt.init_query_time.substring(opt.init_query_time.indexOf('-') + 1);
                if (opt.time_scope == 'quarter') {
                  scope.commoninfo.quarter = Number(quarterMonth);
                  scope.commoninfo.byMonth = false;
                } else {
                  scope.commoninfo.month = Number(quarterMonth);
                  scope.commoninfo.byMonth = true;
                }
              }
              var resData = opt.series;
              var data = [];
              var hasData = false;
              scope.commoninfo.title = opt.title;
              _.forEach(resData, function(item) {
                if (item.name == '今年目标') {
                  _.forEach(item.data, function(data) {
                    if (data.highLight == '1') {

                      scope.commoninfo.totalTitle = '总量';
                      scope.commoninfo.totalAmount = data.value;
                      scope.commoninfo.totalUnit = data.unit;
                      if (data.value != '') {
                        hasData = true;
                      }
                    }
                    if (data.name == '查询时间') {
                      scope.commoninfo.targetThisYear = data.value;
                    }
                    if (data.name == '目标') {
                      scope.commoninfo.targetThisValue = data.value;
                      scope.commoninfo.targetThisUnit = data.unit; // 目标单位
                    }
                  })
                } else {
                  _.forEach(item.data, function(data) {
                    if (data.name == '查询时间') {
                      scope.commoninfo.targetFutureYear = data.value;
                    }
                    if (data.name == '五年目标') {
                      scope.commoninfo.targetFutureValue = data.value;
                      scope.commoninfo.targetFutureUnit = data.unit; // 目标单位
                    }
                  })
                }
              })
              var percent = 0;
              if (scope.commoninfo.totalAmount != '' && scope.commoninfo.targetFutureValue != '') {
                percent = (parseFloat(scope.commoninfo.totalAmount) / parseFloat(scope.commoninfo.targetFutureValue));
              }
              scope.commoninfo.percentFutureYear = (percent * 100).toFixed(1);

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
                  text: scope.commoninfo.targetFutureYear + '年：' + scope.commoninfo.targetFutureValue + scope.commoninfo.targetFutureUnit,
                  left: 'center',
                  top: 'bottom',
                  textStyle: {
                    color: 'rgb(240,240,240)',
                    fontWeight: 'normal',
                    fontSize: 14
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
                      },
                      formatter: function(param) {
                        return scope.commoninfo.percentFutureYear + '%';
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
                chartInstance = echarts.init((element.find('div'))[0]);
                chartInstance.clear();
                chartInstance.resize();
                if (hasData) {
                  chartInstance.setOption(option);
                } else {
                  chartInstance.setOption(optionMap);
                }
              }, 600);

              scope.onResize = function() {
                if (chartInstance) {
                  chartInstance.clear();
                  chartInstance.resize();
                  if (hasData) {
                    chartInstance.setOption(option);
                  } else {
                    chartInstance.setOption(optionMap);
                  }
                }
              }

              angular.element($window).bind('resize', function() {
                scope.onResize();
              })
            })
          }

        }
      }
    }
  ]);

  spot.directive('chartTargetRate', ['spotService', '$window',
    function(spotService, $window) {
      return {
        restrict: 'ACE',
        scope: {
          targetratedata: '=',
          commoninfo: '='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          var chartInstance = null;
          if (!scope.targetratedata || !scope.targetratedata.url) {
            return;
          }

          scope.$watch('targetratedata', function(newValue, oldValue) {
            if (newValue === oldValue || !newValue || !oldValue || newValue.active) {
              return;
            }
            redraw();
          });

          scope.$watch('commoninfo.model', function(newValue, oldValue) {
            if (newValue === oldValue || !newValue || !oldValue) {
              return;
            }
            redraw();
          }, true);
          scope.$watch('commoninfo.quarter', function(newValue, oldValue) {
            if (newValue === oldValue || !newValue || !oldValue) {
              return;
            }
            redraw();
          }, true);
          scope.$watch('commoninfo.month', function(newValue, oldValue) {
            if (newValue === oldValue || !newValue || !oldValue) {
              return;
            }
            redraw();
          }, true);

          // init
          redraw();

          function redraw() {
            scope.commoninfo.promiseTarget.then(function() {
              //  set time params;
              var timeParam = null;
              if (scope.commoninfo && scope.commoninfo.model) {
                timeParam = angular.copy(scope.commoninfo.model);
                if (scope.commoninfo.time_scope == 'quarter') {
                  timeParam.setMonth(scope.commoninfo.quarter - 1);
                } else if (scope.commoninfo.time_scope == 'month') {
                  timeParam.setMonth(scope.commoninfo.month - 1);
                }
              }
              spotService.getDetail(scope.targetratedata.url, {
                queryTime: spotService.getDateFormat(timeParam, 'yyyy-MM'),
                picCode: scope.targetratedata.picCode
              }).then(function(result) {
                var opt = result.data;
                if (!opt || !opt.series) {
                  return;
                }
                scope.commoninfo.dep_name = opt.dep_name;
                scope.targetratedata.active = true; // 为了再次点击菜单时能触发 targetratedata change事件
                if (!scope.commoninfo.model && opt.init_query_time != '') {
                  scope.commoninfo.time_scope = opt.time_scope;
                  scope.commoninfo.byMonth = true;
                  scope.commoninfo.model = new Date(opt.init_query_time);
                  var quarterMonth = opt.init_query_time.substring(opt.init_query_time.indexOf('-') + 1);
                  if (opt.time_scope == 'quarter') {
                    scope.commoninfo.quarter = Number(quarterMonth);
                    scope.commoninfo.byMonth = false;
                  } else {
                    scope.commoninfo.month = Number(quarterMonth);
                    scope.commoninfo.byMonth = true;
                  }
                }

                scope.commoninfo.title = opt.title;
                var resData = opt.series[0].data;
                var data = [];
                var hasData = false;
                _.forEach(resData, function(item) {
                  var obj = {};
                  if (item.value != '') {
                    item.value = parseFloat(item.value);
                  }
                  obj.value = item.value;
                  obj.name = item.name;
                  if (item.highLight == '1') {
                    obj.itemStyle = {
                      normal: {
                        color: 'rgb(155,157,82)',
                        borderColor: 'rgb(245,222,68)',
                        borderWidth: 1
                      }
                    }
                    if (item.value != '') {
                      hasData = true;
                    }
                    scope.commoninfo.targetRateTotal = item.value;
                    scope.commoninfo.targetRateUnit = opt.y_name[0];
                  } else {
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
                scope.commoninfo.othertargetrate = _.filter(resData, function(o) {
                  return o.highLight != '1';
                })
                var option = {
                  tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                      type: 'shadow'
                    },
                    formatter: "{a} <br/>{b} : {c}" + opt.y_name[0]
                  },
                  grid: {
                    left: '9%',
                    right: '8%',
                    bottom: '8%',
                    top: '0',
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
                      interval: 0,
                      textStyle: {
                        color: 'rgb(246,246,246)',
                        fontSize: 14
                      }
                    },
                    data: _.map(data, 'name')
                  },
                  series: [{
                    name: opt.series[0].name,
                    type: 'bar',
                    barMaxWidth: (data.length < 3) ? '30%' : '50%',
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
                  chartInstance = echarts.init((element.find('div'))[0]);
                  chartInstance.clear();
                  chartInstance.resize();
                  if (hasData) {
                    chartInstance.setOption(option);
                  } else {
                    chartInstance.setOption(optionMap);
                  }
                }, 600);

                scope.onResize = function() {
                  if (chartInstance) {
                    chartInstance.clear();
                    chartInstance.resize();
                    if (hasData) {
                      chartInstance.setOption(option);
                    } else {
                      chartInstance.setOption(optionMap);
                    }
                  }
                }

                angular.element($window).bind('resize', function() {
                  scope.onResize();
                })
              })
            })
          }

        }
      }
    }
  ]);

  spot.filter('toPositive', function() {
    return function(num) {
      return Math.abs(num);
    }
  })

})();
