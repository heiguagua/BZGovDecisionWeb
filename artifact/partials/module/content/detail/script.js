(function() {
  /** Module */
  var detail = angular.module('app.main.module.content.detail', ['ui.bootstrap']);
  /** Controller */
  detail.controller('detailController', [
    '$scope', 'detailService', '$stateParams', 'uibDateParser',
    function($scope, detailService, $stateParams, uibDateParser) {
      var vm = this;

      $scope.popups = [];
      $scope.quarterOptions = [{
        'id': 3,
        "name": "第一季度"
      }, {
        'id': 6,
        "name": "第二季度"
      }, {
        'id': 9,
        "name": "第三季度"
      }, {
        'id': 12,
        "name": "第四季度"
      }];
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
          //alert('请输入正确的日期格式！');
          return;
        }
        if ($scope.popups[index].time_scope == 'quarter') {
          if (!$scope.popups[index].quarter) {
            alert('请选择季度！');
            return;
          }
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
          // var mainHeightFst = $('.content-main')[0].scrollHeight;
          // $('.side-nav').css({'height':mainHeightFst + "px"});
          // var box_height = $('.content-box').height() * 0.8 + 'px';
          // $('.content-box .chart').css({
          //   'height': box_height
          // });

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

          scope.$watch('content.quarter', function(newValue, oldValue) {
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
            var timeParam = angular.copy(scope.content.model);
            var timeFormatParam = angular.copy(scope.content.format);
            if (scope.content.model && scope.content.time_scope == 'quarter') {
              timeParam.setMonth(scope.content.quarter - 1);
              timeFormatParam = 'yyyy-MM';
            }
            detailService.getDetail(scope.content.url, {
              queryTime: getDateFormat(timeParam, timeFormatParam),
              picCode: scope.content.picCode
            }).then(function(result) {
              var opt = result.data;
              if (opt && opt.series && opt.series[0]) {
                if (!scope.content.model && opt.init_query_time != '') {
                  scope.content.model = new Date(opt.init_query_time);
                  if (!scope.content.quarter) {
                    var quarterMonth = opt.init_query_time.substring(opt.init_query_time.indexOf('-') + 1);
                    scope.content.quarter = Number(quarterMonth);
                  }
                }
                scope.content.dep_name = opt.dep_name;
                scope.content.time_scope = opt.time_scope;
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
                if (opt.time_scope == 'quarter') {
                  scope.content.format = 'yyyy';
                  dateOptions.minMode = 'year';
                  dateOptions.datepickerMode = 'year';
                }
                scope.content.dateOptions = dateOptions;



                opt.yAxis = [];
                _.forEach(opt.y_name, function(item, index) {

                  var yAxis = {};
                  yAxis.type = 'value';
                  yAxis.name = item;
                  yAxis.axisTick = {};
                  yAxis.axisTick.inside = true;

                  if (opt.max_and_min) {
                    var minValue = Number(opt.max_and_min[index].minValue);
                    var maxValue = Number(opt.max_and_min[index].maxValue);
                    if(minValue>=0 && minValue < 1) {
                      minValue = 0;
                    }
                    else{
                      minValue = minValue-1;
                    }
                    maxValue = 1 + maxValue;
                    yAxis.min = Math.round(minValue);
                    yAxis.max = Math.round(maxValue);
                  }
                  yAxis.splitBumber = 5;
                  yAxis.interval = (yAxis.max-yAxis.min)/yAxis.splitBumber;
                  yAxis.axisLine = {onZero:false};
                  yAxis.axisLabel = {};
                  yAxis.axisLabel.formatter = function(value){
                    if(((value + '').indexOf('.') != -1) ) {
                      return value.toFixed(1);
                    }
                    return value;
                  };
                  opt.yAxis.push(yAxis);
                });

                var colors = ['rgb(0,112,192)', 'rgb(72,200,126)', 'rgb(228,92,93)', 'rgb(71,190,121)'];
                var pie_colors = ['#FFF', 'rgb(90,177,239)', 'rgb(46,199,201)', 'rgb(182,162,222)', 'rgb(228,92,93)'];
                var group_colors = ['rgb(90,177,239)', 'rgb(46,199,201)', 'rgb(182,162,222)', 'rgb(228,92,93)'];
                if (opt.series[0].type == 'pie') {
                  option.series = opt.series;
                  if (option.series.length == 1) {
                    pie_colors = group_colors;
                    option.series[0].radius = [0, '50%'];
                  }
                  option.color = pie_colors;
                  if (opt.series.length > 1) {
                    option.series[0].radius = [0, '26%'];
                    option.series[1].label = {};
                    option.series[1].label.normal = {};
                    //  option.series[1].label.normal.formatter = '{b}\n {c}' + opt.y_name[1];
                    option.series[1].label.normal.formatter = function(obj) {
                      var percentShow = '';

                      var labelShow = '\n\n' + obj.data.name + '\n';
                      if (obj.data.other && obj.data.other.length > 1) {
                        for (var i = 0; i < obj.data.other.length; i++) {
                          labelShow += obj.data.other[i].name + ":" + obj.data.other[i].value + '\n';
                        }
                      } else {
                        labelShow = obj.data.name + ":" + obj.data.value + '\n';
                        if (opt.auto_count && opt.auto_count == 'percent') {
                          labelShow += '占比：' + obj.percent + '%';
                        }
                      }


                      return labelShow;
                    }
                    option.series[1].radius = ['26%', '48%'];
                  }
                  option.tooltip = {
                    trigger: 'item',
                    formatter: function(obj) {
                      var labelShow = obj.data.name + '<br/>';
                      if (obj.data.other && obj.data.other.length > 1) {
                        for (var i = 0; i < obj.data.other.length; i++) {
                          labelShow += obj.data.other[i].name + ":" + obj.data.other[i].value + '<br/>';
                        }
                      } else {
                        labelShow = obj.data.name + ":" + obj.data.value + '\n';
                        if (opt.auto_count && opt.auto_count == 'percent') {
                          labelShow += '占比：' + obj.percent + '%';
                        }
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
                  if (option.series.length == 1) {
                    option.series[0].label.normal.position = 'outside';
                  }
                  option.series[0].label.normal.formatter = '{b}\n {c}' + opt.y_name[0];
                  option.series[0].label.normal.textStyle = {
                    color: "#333"
                  };

                } else
                if (opt.series[0].type == 'radar') {
                  var indicators = [];
                  _.forEach(opt.x_data, function(item, index) {
                    var indicator = {};
                    indicator.name = item;
                      var max = 0;
                      var min = 0;
                    if(opt.series[0].data.length == 1) {
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
                    }
                    else{
                      var dataArray = _.map(opt.series[0].data, 'value');
                      max = Number(dataArray[0][0]);
                      min = Number(dataArray[0][0]);
                      _.forEach(dataArray[index], function(data) {
                        if (Number(data) > max) {
                          max = Number(data);
                        }
                        if (Number(data) < min) {
                          min = Number(data);
                        }
                      });
                    }

                    indicator.max = max;
                    indicator.min = min*0.8;
                    indicators.push(indicator);
                  });
                  option.color = colors;
                  option.tooltip = {};
                  option.legend = {
                    top: 'bottom',
                    bottom: 20,
                    data: opt.legend,
                    textStyle: {
                      fontSize: 14,
                      fontWeight:'bolder'
                    }
                  };
                  option.title = {
                    text: opt.title,
                    left: 'center'
                  };
                  option.radar = {};
                  option.radar.name = {
                    textStyle: {
                      color: '#333',
                      fontSize: 14
                    }
                  };
                  option.radar.nameGap = 8;
                  option.radar.radius = '60%';
                  option.radar.indicator = indicators;
                  if(scope.content.picCode == '2321') {
                    option.radar.startAngle = 162;
                  }
                  option.series = opt.series;
                } else {
                  var stack_name = '';
                  var labelPos = 'top';
                  var axisLabel = {};
                  var grid_btm = 70;
                  if (opt.need_group == "1") {
                    stack_name = 'group';
                    labelPos = 'inside';
                    colors = group_colors;
                  }
                  if (opt.series[0].data.length > 10) {
                    axisLabel = {
                      interval: 0,
                      formatter: function(val) {
                        if (val.indexOf('月') > -1) {
                          return val;
                        }
                        return val.split("").join("\n"); //横轴信息文字竖直显示
                      }

                    };
                  };
                  axisLabel.textStyle ={
                    fontWeight:'bolder'
                  };
                  _.forEach(opt.series, function(item,index) {
                    item.label = {
                      normal: {
                        show: true,
                        position: labelPos,
                        textStyle: {
                          color: '#333',
                          fontSize: 12
                        }
                      }
                    };
                    if(scope.content.picCode == '4211' || scope.content.picCode == '4221') {
                      item.label.normal = {
                        show:false
                      };
                    }
                    if (item.type == 'bar') {
                      if (item.data.length < 3) {
                        item.barMaxWidth = '20%';
                      } else {
                        item.barMaxWidth = '40%';
                        if (item.data.length > 10) {
                          item.label = {
                            normal: {
                              show: false
                            }
                          }
                        }
                        else{
                          item.label = {
                            normal: {
                              show: true,
                              position: labelPos,
                              textStyle: {
                                color: '#333',
                                fontSize: 12,
                                fontWeight:'bolder'
                              }
                            }
                          };
                        }
                      }
                    }
                    if (item.type == 'line') {
                      var datas = _.map(item.data, 'name');
                      if (datas && datas.length > 1 && (_.uniq(datas).length == 1)) {
                        item.symbol = 'roundCircle';
                        item.symbolSize = 1;
                        _.forEach(item.data, function(idata, dataIndex) {
                          if (dataIndex == 0) {
                            idata.label = {
                              normal: {
                                show: true,
                                textStyle: {
                                  color: colors[2],
                                  fontWeight:'bolder'
                                }
                              }
                            }
                          } else {
                            idata.label = {
                              normal: {
                                show: false
                              }
                            }
                          }
                        })
                      }
                    }
                    if (item.data.length > 5) {
                      // $('.box-wrap').css({
                      //   '-webkit-flex-flow': 'column',
                      //   'flex-flow': 'column'
                      // });

                      _.forEach(item.data, function(data) {
                        if (data.name && data.name.length > 5 && item.data.length > 12) { // 字符长度大于5
                          if(scope.content.picCode == '2322') {
                            grid_btm = 100;
                          }
                          else{
                            grid_btm = 190;
                          }
                        }
                      })
                    }

                    item.connectNulls = true;
                    //  item.label = label;
                    item.stack = stack_name;

                  });
                  var screen_width = screen.width;
                  var grid_left = '10%';
                  var grid_right = '10%';
                  if(screen_width < 1600) {
                    grid_left = '15%';
                    grid_right = '15%';
                  }
                  option = {
                    color: colors,
                    title: {
                      text: opt.title,
                      left: 'center',
                      top:-4
                    },
                    tooltip: {
                      trigger: 'axis'
                    },
                    legend: {
                      top: 'bottom',
                      bottom: 20,
                      data: opt.legend,
                      textStyle: {
                        fontSize: 14,
                        fontWeight:'bolder'
                      }
                    },
                    grid: {
                      bottom: grid_btm,
                      top: '15%',
                      left:grid_left,
                      right:grid_right
                    },
                    xAxis: [{
                      type: 'category',
                      axisTick: {
                        show: false
                      },
                      axisLabel: axisLabel,
                      data: opt.x_data
                    }],
                    yAxis: opt.yAxis,
                    series: opt.series
                  };
                }
                // table data
                if (opt.table_type == 'same') {
                  scope.content.columnNames = opt.x_data;
                  var rowDatas = [];

                  if (opt.series[0].type == 'radar') {
                    _.forEach(opt.series[0].data, function(serData, index) {
                      var dataObj = {};
                      dataObj.rowName = serData.name;
                      var cellDatas = [];
                      _.forEach(serData.value, function(data) {
                        var cellData = {};
                        cellData.value = data;
                        cellDatas.push(cellData);
                      })
                      dataObj.rowValue = cellDatas;
                      rowDatas.push(dataObj);
                    });
                  } else {
                    _.forEach(opt.legend, function(legendData, index) {
                      var dataObj = {};
                      dataObj.rowName = legendData;
                      dataObj.rowValue = opt.series[index].data;
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
                    if (opt.series[0].type == 'radar') {
                      _.forEach(opt.series[0].data, function(serData, index2) {
                        var cellData = {};
                        cellData.name = serData.name;
                        cellData.value = serData.value[index];
                        cellDatas.push(cellData);
                      });
                    } else {
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
                } else if (opt.table_type == 'form') {
                  scope.content.formTable = true;
                  detailService.getTableData(opt.table_url, {
                    picCode: scope.content.picCode,
                    queryTime: getDateFormat(timeParam, timeFormatParam)
                  }).then(function(res) {
                    scope.content.rowData = res.data;
                  })
                } else {
                  detailService.getTableData(opt.table_url, {
                    picCode: scope.content.picCode,
                    queryTime: getDateFormat(timeParam, timeFormatParam)
                  }).then(function(res) {
                    // if (res.data.columnName.length > 5) {
                    //   $('.box-wrap').css({
                    //     '-webkit-flex-flow': 'column',
                    //     'flex-flow': 'column'
                    //   });
                    // }
                    scope.content.columnNames = res.data.columnName;

                    scope.content.rowData = res.data.rowData;
                  })
                }

                if (scope.content.picCode == '4112') { // 全市服务业企业登记情况,特殊处理
                  var enTotal = opt.series[0].data;
                  var enNum = opt.series[1].data;
                  element.find('div')[0].innerHTML = '<div class="item-wrap">' +
                    '<div class="chart-item"><div class="item"><div class="pic pic-home"><i class="fa fa-home"></i></div></div><div class="item"><div class="pic pic-home"><i class="fa fa-rmb"></i></div></div></div>' +
                    '<div class="chart-item"><div class="item"><div class="content-item">' + enTotal[0].name + enTotal[0].value + enTotal[0].unit + '</div></div><div class="item"><div class="content-item">' + opt.series[1].name + "：" + enNum[1].value + enNum[0].unit + '</div></div></div>' +
                    '<div class="chart-item"><div class="item"><div class="content-item">' + enTotal[1].name + enTotal[1].value + enTotal[1].unit + '</div></div><div class="item"><div class="content-item">' + opt.series[1].name + "：" + enNum[1].value + enNum[1].unit + '</div></div></div>' +
                    '<div>';
                } else {
                  setTimeout(function() {
                    chartInstance = echarts.init((element.find('div'))[0]);
                    //element.find('div')[0].style.height = $('.graph').height() + 'px';
                    chartInstance.clear();
                    chartInstance.resize();
                    chartInstance.setOption(option);
                    // var mainHeight = $('.content-main')[0].scrollHeight;
                    // $('.side-nav').css({'height':mainHeight + "px"});
                  }, 600);
                }

              }

            });
          }

          scope.onResize = function() {
            if (chartInstance) {
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
