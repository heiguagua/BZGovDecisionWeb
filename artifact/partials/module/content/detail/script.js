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
          popup.model = new Date(item.time);

          var dateOptions = {};
          dateOptions.formatYear = 'yyyy';
          if (item.queryTime == 'year') {
            popup.format = 'yyyy';
            dateOptions.minMode = 'year';
            dateOptions.datepickerMode = 'year';
          }
          if (item.queryTime == 'month') {
            popup.format = 'yyyy-MM';
            dateOptions.minMode = 'month';
            dateOptions.datepickerMode = 'month';
            popup.model.setMonth(popup.model.getMonth() - 1);
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

      function getTableData(tableUrl,params){
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
          function drawChart(){
            detailService.getDetail(scope.content.url, {
              queryTime: getDateFormat(scope.content.model, scope.content.format)
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
              var colors = ['#0070c0', '#20b3a9', '#ff0000'];

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

              if(opt.table_type == 'same'){
                scope.content.columnNames = opt.x_data;
                scope.content.rowData = opt.series;
              }
              else if(opt.table_type == 'reverse') {
                scope.content.columnNames = opt.legend;
                scope.content.rowData = opt.series;
              }
              else{
                detailService.getTableData(opt.table_url,{queryTime:scope.content.queryTime}).then(function(res){
                  scope.content.columnNames = res.data.body[0].column;
                  scope.content.rowData = res.data.body[0].series;
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
