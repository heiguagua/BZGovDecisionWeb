(function() {
  /** Module */
  var goalprogress = angular.module('app.main.module.content.goalprogress', ['ui.bootstrap', 'cgBusy']);
  /** Controller */
  goalprogress.controller('goalprogressController', [
    '$scope', 'goalprogressService', '$stateParams', 'uibDateParser', '$rootScope',
    function($scope, goalprogressService, $stateParams, uibDateParser, $rootScope) {
      var vm = this;
      $rootScope.mname = $stateParams.mname;
      setTimeout(function() {
        $('.menu-label').removeClass('m-collapse');
      }, 600);
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
          alert('请输入正确的日期格式！');
          return;
        }
        if (!$scope.datepick.quarter) {
          alert('请选择季度！');
          return;
        }
        getDataDetails({
          year: goalprogressService.getDateFormat($scope.datepick.model, 'yyyy'),
          quarter: $scope.datepick.quarter
        });
      }

      $scope.qtchanged = function() {
        if (!angular.isDate($scope.datepick.model) || isNaN($scope.datepick.model.getTime())) {
          alert('请输入正确的日期格式！');
          return;
        }
        if (!$scope.datepick.quarter) {
          alert('请选择季度！');
          return;
        }
        _.forEach($scope.alldatas, function(item) {
          var url = item.url + '/' + item.picCode;
          if (item.picCode == 'cityQuarterlyTargetSchedule') {
            goalprogressService.getContentDatas(url, {
              year: $scope.datepick.year,
              quarter: $scope.datepick.quarter
            }).then(function(res) {
              $scope.cityYearData = res.data;
              $scope.cityYearData.url = url;
              $scope.datepick.model = new Date($scope.cityYearData.year);
              $scope.datepick.quarter = Number($scope.cityYearData.quarter);
            })
          }
        })
      }
      $scope.altInputFormats = ['M!/d!/yyyy'];

      function getDataDetails(params) {
        _.forEach($scope.alldatas, function(item) {
          var url = item.url + '/' + item.picCode;

          goalprogressService.getContentDatas(url, params).then(function(res) {
            if (item.picCode == 'cityYearlyTargetSchedule') {
              $scope.cityQuarterData = res.data;
            }
            if (item.picCode == 'cityQuarterlyTargetSchedule') {
              $scope.cityYearData = res.data;
              $scope.cityYearData.url = url;
              $scope.datepick.model = new Date($scope.cityYearData.year);
              $scope.datepick.year = goalprogressService.getDateFormat($scope.datepick.model, 'yyyy');
              $scope.datepick.quarter = Number($scope.cityYearData.quarter);
            }
          })
        })
      }

      goalprogressService.getContent({
        menuId: $stateParams.pid
      }).then(function(result) {
        $scope.alldatas = result.data;
        getDataDetails();
      })

      Date.prototype.Format = function (fmt) { //author: meizz
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

  /** Service */
  goalprogress.factory('goalprogressService', ['$http', 'URL',
    function($http, URL) {
      return {
        "getContent": getContent,
        "getContentDatas": getContentDatas,
        "getDateFormat": getDateFormat
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

  goalprogress.directive('wiservGoalProgress', ['goalprogressService', '$window',
    function(goalprogressService, $window) {
      return {
        restrict: 'ACE',
        scope: {
          yearlydata: '=',
          datemodel: '='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {

          scope.$watch('yearlydata', function(newValue, oldValue) {
            if (newValue === oldValue || !newValue || !oldValue) {
              return;
            }
            redraw();
          }, true);

          redraw();

          function redraw() {
            if (scope.yearlydata) {
              var normalData = [];
              var delayData = [];
              scope.datemodel.quarter = Number(scope.datemodel.quarter);
              _.forEach(scope.yearlydata.data.value, function(item) {
                if (item.name == 'nomal') {
                  normalData = item.data;
                }
                if (item.name == 'delay') {
                  delayData = item.data;
                }
              });
              var screen_width = screen.width;
              var option = {
                title: {
                  text: '全市目标任务进度',
                  // subtext: '数据来源：市委目督办',
                  left: 'center',
                  top: '4%'
                },
                color: ['rgb(49,167,229)', 'rgb(40,200,202)'],
                tooltip: {
                  trigger: 'axis',
                  axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                  }
                },
                legend: {
                  data: ['进度正常', '进度滞后'],
                  top: '13%',
                  itemGap: 50
                },
                grid: {
                  top: '26%',
                  left: '3%',
                  right: '4%',
                  bottom: '3%',
                  containLabel: true
                },
                xAxis: [{
                  type: 'category',
                  axisLabel: {
                    interval: 0,
                    formatter : function(val) {
                      var newstr = '';
                      if(screen_width<1024) {
                        var char_length = val.length;
                        if (char_length > 4) {
                          var strTemp = '';
                          var leftStr = '';
                          //for(var i=0; i<(char_length/5); i++) {
                            //if(i != 0) {
                            strTemp = val.substring(0, char_length-3);
                            leftStr = val.substring(char_length-3);
                            newstr = strTemp + '\n' + leftStr;
                            //}
                          //}
                        }
                        else{
                          newstr = val;
                        }
                      }
                      else{
                        newstr = val;
                      }

                      return newstr;
                    }
                  },
                  data: scope.yearlydata.data.area
                }],
                yAxis: [{
                  type: 'value',
                  name: '项',
                  nameGap: 8
                }],
                series: [{
                  name: '进度正常',
                  type: 'bar',
                  barMaxWidth: '50%',
                  stack: '纳入本月',
                  data: normalData,
                  label: {
                    normal: {
                      show: true
                    }
                  },
                }, {
                  name: '进度滞后',
                  type: 'bar',
                  barMaxWidth: '50%',
                  stack: '纳入本月',
                  data: delayData,
                  label: {
                    normal: {
                      show: true
                    }
                  },
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

  goalprogress.directive('wiservGoalRate', ['goalprogressService', '$window',
    function(goalprogressService, $window) {
      return {
        restrict: 'ACE',
        scope: {
          quarterlydata: '=',
          datemodel: '='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          scope.$watch('quarterlydata', function(newValue, oldValue) {
            if (newValue === oldValue || !newValue || !oldValue) {
              return;
            }
            redraw();
          }, true);

          redraw();

          function redraw() {
            if (scope.quarterlydata) {
              var dataList = [];
              _.forEach(scope.quarterlydata.value, function(item) {
                if (item.quarter == 1) {
                  item.name = '第一季度';
                }
                if (item.quarter == 2) {
                  item.name = '第二季度';
                }
                if (item.quarter == 3) {
                  item.name = '第三季度';
                }
                if (item.quarter == 4) {
                  item.name = '第四季度';
                }
                item.type = 'line';
                item.label = {
                  normal: {
                    show: true
                  }
                };
              });
              var screen_width = screen.width;
              var itemGap = 50;
              var grid_top = '26%';
              if(screen_width < 1024) {
                itemGap = 10;
                grid_top = '34%';
              }
              var option = {
                title: {
                  text: scope.datemodel.year + '年全市目标工作正常推进率',
                  // subtext: '数据来源：市委目督办',
                  left: 'center',
                  top: '4%'
                },
                color: ['rgb(49,167,229)', 'rgb(40,200,202)', 'rgb(221,129,142)','rgb(97,160,168)'],
                tooltip: {
                  trigger: 'axis',
                  axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                  },
                  formatter: function(params) {
                    console.log(params);
                    var html = params[0].name + "<br/>";
                    _.forEach(params, function(item) {
                      var value = item.value=='' ? item.value : parseFloat(item.value);
                      html += item.seriesName + ":" + value + "<br/>";
                    })
                    return html;
                  }
                },
                legend: {
                  data: _.map(scope.quarterlydata.value, 'name'),
                  top: '13%',
                  itemGap: itemGap
                },
                grid: {
                  top: grid_top,
                  left: '3%',
                  right: '4%',
                  bottom: '3%',
                  containLabel: true
                },
                xAxis: [{
                  type: 'category',
                  axisLabel: {
                    interval: 0,
                    formatter : function(val) {
                      var newstr = '';
                      if(screen_width<1024) {
                        var char_length = val.length;
                        if (char_length > 4) {
                          var strTemp = '';
                          var leftStr = '';
                          //for(var i=0; i<(char_length/5); i++) {
                            //if(i != 0) {
                            strTemp = val.substring(0, char_length-3);
                            leftStr = val.substring(char_length-3);
                            newstr = strTemp + '\n' + leftStr;
                            //}
                          //}
                        }
                        else{
                          newstr = val;
                        }
                      }
                      else{
                        newstr = val;
                      }

                      return newstr;
                    }
                  },
                  data: scope.quarterlydata.area
                }],
                yAxis: [{
                  type: 'value',
                  name: '%',
                  nameGap: 8
                }],
                series: scope.quarterlydata.value
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
