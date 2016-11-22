(function() {
  /** Module */
  var detail = angular.module('app.main.module.content.detail', ['ui.bootstrap']);
  /** Controller */
  detail.controller('detailController', [
    '$scope', 'detailService', '$stateParams', 'uibDateParser',
    function($scope, detailService, $stateParams, uibDateParser) {
      var vm = this;

      $scope.popups = [];

      detailService.getContent({
        menuId: $stateParams.pid
      }).then(function(result) {
        vm.dcontent = _.sortBy(result.data, ['picCode']);
        _.forEach(vm.dcontent, function(item) {
          var popup = {};
          popup.opened = false;
          popup.url = item.url;
          popup.picCode = item.picCode;
          $scope.popups.push(popup);

        });
      })

      $scope.open = function(index) {
        $scope.popups[index].opened = true;
      };

      $scope.changed = function(index) {
        if (!angular.isDate($scope.popups[index].model) || isNaN($scope.popups[index].model.getTime())) {
          alert('请输入正确的日期格式！');
          return;
        }
      }
      $scope.altInputFormats = ['M!/d!/yyyy'];

      function getDateFormat(parseDate, format) {
        var date = angular.copy(parseDate);
        if (angular.isDate(date) && !isNaN(date.getTime())) {
          return date.Format(format);
        } else {
          return '';
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

  /** Service */
  detail.factory('detailService', ['$http', 'URL',
    function($http, URL) {
      return {
        getContent: getContent,
        getDetail: getDetail,
        getTableData: getTableData
      }

      function getContent(params) {
        return $http.get(
          URL + '/main/showPics', {
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

      function getTableData(tableUrl, params) {
        return $http.get(
          URL + tableUrl, {
            params: params
          }
        )
      }
    }
  ]);

  detail.directive('wiservChart', ['detailService', '$window',
    function(detailService, $window) {
      return {
        restrict: 'ACE',
        scope: {
          content: '='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          console.log(scope.content);
          function getDateFormat(parseDate, format) {
            var date = angular.copy(parseDate);
            if (angular.isDate(date) && !isNaN(date.getTime())) {
              return date.Format(format);
            } else {
              return '';
            }
          }
          scope.$watch('content.model', function(newValue, oldValue) {
            if (newValue === oldValue || !newValue || !oldValue) {
              return;
            } // AKA first run
            drawChart();
          });
          var chartInstance = null;
          var option = {};
          drawChart();

          // draw chart
          function drawChart() {
            detailService.getDetail(scope.content.url, {
              queryTime: getDateFormat(scope.content.model, scope.content.format),
              picCode: scope.content.picCode
            }).then(function(result) {
              var opt = result.data;
              if (!scope.content.model && opt.init_query_time != '') {
                scope.content.model = new Date(opt.init_query_time);
              }

              var dateOptions = {};
              dateOptions.formatYear = 'yyyy';
              if (opt.time_scope == 'year') {
                scope.content.format = 'yyyy';
                dateOptions.minMode = 'year';
                dateOptions.datepickerMode = 'year';
              }
              if (opt.time_scope == 'month') {
                scope.content.format = 'yyyy-MM';
                dateOptions.minMode = 'month';
                dateOptions.datepickerMode = 'month';
              }
              scope.content.dateOptions = dateOptions;

              opt.yAxis = [];
              _.forEach(opt.y_name, function(item) {
                var yAxis = {};
                yAxis.type = 'value';
                yAxis.name = item;
                yAxis.axisTick = {};
                yAxis.axisTick.inside = true;
                opt.yAxis.push(yAxis);
              });

              var colors = ['#0070c0', '#20b3a9', '#CC6600', '#ff0000'];

              if (opt.series[0].type == 'pie') {
                option.series = opt.series;
                if (opt.series.length > 1) {
                  option.series[0].radius = [0, '30%'];
                  option.series[1].label = {};
                  option.series[1].label.normal = {};
                  option.series[1].label.normal.position = 'inner';
                //  option.series[1].label.normal.formatter = '{b}\n {c}' + opt.y_name[1];
                option.series[1].label.normal.formatter = function(obj) {
                  var labelShow = obj.data.name + '\n';
                  if(obj.data.other && obj.data.other.length > 1) {
                    for(var i=0; i<obj.data.other.length; i++) {
                      labelShow += obj.data.other[i].name + ":"+ obj.data.other[i].value +'\n';
                    }
                  }
                  else{
                    labelShow += obj.data[0].name + ":"+ obj.data[0].value ;
                  }

                  return labelShow;
                }
                  option.series[1].radius = ['30%', '60%'];
                }
                option.tooltip = {
                  trigger: 'item',
                  formatter: function(obj) {
                    var labelShow = obj.data.name + '<br/>';
                    for(var i=0; i<obj.data.other.length; i++) {
                      labelShow += obj.data.other[i].name + ":"+ obj.data.other[i].value +'<br/>';
                    }
                    return labelShow;
                  }
                };
                option.title = {
                  text: opt.title,
                  left: 'center'
                };
                option.series[0].label = {};
                option.series[0].label.normal = {};
                option.series[0].label.normal.position = 'center';
                option.series[0].label.normal.formatter = '{b}\n {c}' + opt.y_name[0];
                option.series[0].label.normal.textStyle = {
                  color: "#FFF"
                };

              } else
              if (opt.series[0].type == 'radar') {
                var indicators = [];
                _.forEach(opt.x_data, function(item, index) {
                  var indicator = {};
                  indicator.name = item;
                  var dataArray = _.map(opt.series[0].data, 'value');
                  var max = opt.series[0].data[0].value[index];
                  _.forEach(dataArray, function(data, index2) {
                    if (opt.series[0].data[index2].value[index] > max) {
                      max = opt.series[0].data[index2].value[index];
                    }
                  });
                  indicator.max = max + 100;
                  indicators.push(indicator);
                });
                option.tooltip = {};
                option.title = {
                  text: opt.title,
                  left: 'center'
                };
                option.radar = {};
                option.radar.indicator = indicators;
                option.series = opt.series;
              } else {
                var stack_name = '';
                var labelPos = 'top';
                if (opt.need_group == "1") {
                  stack_name = 'group';
                  labelPos = 'inside';
                }
                _.forEach(opt.series, function(item) {
                  item.barWidth = '30%';
                  var label = {
                    normal: {
                      show: true,
                      position: labelPos,
                      textStyle: {
                        color: '#333',
                        fontSize: 12
                      }
                    }
                  };
                  item.label = label;
                  item.stack = stack_name;
                });
                option = {
                  color: colors,
                  title: {
                    text: opt.title,
                    left: 'center'
                  },
                  tooltip: {
                    trigger: 'axis'
                  },
                  legend: {
                    top: 'bottom',
                    bottom: 20,
                    data: opt.legend
                  },
                  xAxis: [{
                    type: 'category',
                    axisTick: {
                      show: false
                    },
                    data: opt.x_data
                  }],
                  yAxis: opt.yAxis,
                  series: opt.series
                };
              }
              if (opt.table_type == 'same') {
                scope.content.columnNames = opt.x_data;
                var rowDatas = [];
                _.forEach(opt.legend, function(legendData, index) {
                  var dataObj = [];
                  dataObj.rowName = legendData;
                  dataObj.rowValue = opt.series[index].data;
                  rowDatas.push(dataObj);
                });
                if(opt.series[0].type == 'radar') {
                  _.forEach(opt.series[0].data, function(serData, index) {
                    var dataObj = [];
                    dataObj.rowName = serData.name;
                    dataObj.rowValue = serData.value;
                    rowDatas.push(dataObj);
                  });
                }
                scope.content.rowData = rowDatas;
              } else if (opt.table_type == 'reverse') {

                scope.content.columnNames = opt.legend;
                var rowDatas = [];
                _.forEach(opt.x_data, function(item, index) {
                  var dataObj = {};
                  dataObj.rowName = item;
                  var cellDatas = [];
                  if(opt.series[0].type == 'radar') {
                    _.forEach(opt.series[0].data, function(serData, index2) {
                      var cellData = {};
                      cellData.name = serData.name;
                      cellData.value = serData.value[index];
                      cellDatas.push(cellData);
                    });
                  }
                  else{
                    _.forEach(opt.series, function(serData, index2) {
                      var cellData = {};
                      cellData.name = serData.name;
                      cellData.value = opt.series[index2].data[index].value;
                      cellDatas.push(cellData);
                    });
                  }

                  dataObj.rowValue = cellDatas;
                  rowDatas.push(dataObj);
                });
                scope.content.rowData = rowDatas;
              } else {
                detailService.getTableData(opt.table_url, {
                  picCode: scope.content.picCode,
                  queryTime: getDateFormat(scope.content.model, scope.content.format)
                }).then(function(res) {
                  scope.content.columnNames = res.data.columnName;
                  scope.content.rowData = res.data.rowData;
                })
              }
              setTimeout(function() {
                chartInstance = echarts.init((element.find('div'))[0]);
                chartInstance.clear();
                chartInstance.resize();
                chartInstance.setOption(option);
              }, 1000);
            });
          }

          scope.onResize = function() {
            if(chartInstance) {
              chartInstance.resize();
            }
          }

          angular.element($window).bind('resize', function() {
            scope.onResize();
          })


        }
      }
    }
  ]);


})();
