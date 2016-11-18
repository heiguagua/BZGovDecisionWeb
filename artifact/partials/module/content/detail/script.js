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
        vm.content = (result && result.data) ? result.data.body : "";
        _.forEach(vm.content, function(item) {
          var popup = {};
          popup.opened = false;
          popup.url = item.url;
          popup.picCode = item.picCode;
          popup.model = new Date(item.init_query_time);
          console.log(popup.model);

          var dateOptions = {};
          dateOptions.formatYear = 'yyyy';
          if (item.time_scope == 'year') {
            popup.format = 'yyyy';
            dateOptions.minMode = 'year';
            dateOptions.datepickerMode = 'year';
          }
          if (item.time_scope == 'month') {
            popup.format = 'yyyy-MM';
            dateOptions.minMode = 'month';
            dateOptions.datepickerMode = 'month';
          }
          popup.dateOptions = dateOptions;
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
          function getDateFormat(parseDate, format) {
            var date = angular.copy(parseDate);
            if (angular.isDate(date) && !isNaN(date.getTime())) {
              return date.Format(format);
            } else {
              return '';
            }
          }
          scope.$watch('content.model', function(newValue, oldValue) {
            if (newValue === oldValue) {
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
              time_scope: getDateFormat(scope.content.model, scope.content.format)
            }).then(function(result) {
              var opt = result.data.body[0];
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
                option.tooltip = {
                  trigger: 'item',
                  formatter: '{b} <br/>' + opt.legend[0] + ': {c}' + opt.y_name[0] + '<br/>' + opt.legend[1] + ': {d}%'
                };
                option.series = opt.series;
                option.series[0].radius = [0, '30%'];
                option.series[0].label = {};
                option.series[0].label.normal = {};
                option.series[0].label.normal.position = 'center';
                option.series[0].label.normal.formatter = '{b}\n {c}' + opt.y_name[0];
                option.series[0].label.normal.textStyle = {
                  color: "#FFF"
                };
                option.series[1].label = {};
                option.series[1].label.normal = {};
                option.series[1].label.normal.position = 'inner';
                option.series[1].label.normal.formatter = '{b}\n {c}' + opt.y_name[1];
                option.series[1].radius = ['30%', '60%'];
              } else if (opt.series[0].type == 'radar') {
                var indicators = [];
                _.forEach(opt.x_data, function(item,index) {
                  var indicator = {};
                  indicator.name = item;
                  var dataArray = _.map(opt.series[0].data,'value');
                  var max = opt.series[0].data[0].value[index];
                  _.forEach(dataArray,function(data,index2){
                    if(opt.series[0].data[index2].value[index] > max){
                      max = opt.series[0].data[index2].value[index];
                    }
                  });
                  indicator.max = max + 100;
                  indicators.push(indicator);
                });
                console.log(indicators);
                option.tooltip = {};
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
                scope.content.rowData = opt.series;
              } else if (opt.table_type == 'reverse') {
                scope.content.columnNames = opt.legend;
                scope.content.rowData = opt.series;
              } else {
                detailService.getTableData(opt.table_url, {
                  time_scope: scope.content.time_scope
                }).then(function(res) {
                  scope.content.columnNames = res.data.body[0].column;
                  scope.content.rowData = res.data.body[0].series;
                })
              }
              setTimeout(function() {
                chartInstance = echarts.init((element.find('div'))[0]);
                console.log(option);
                chartInstance.clear();
                chartInstance.resize();
                chartInstance.setOption(option);
              }, 1000);
            });
          }

          scope.onResize = function() {
            chartInstance.resize();
          }

          angular.element($window).bind('resize', function() {
            scope.onResize();
          })


        }
      }
    }
  ]);


})();
