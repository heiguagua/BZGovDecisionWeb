(function () {
  /** Module */
  var detail = angular.module('app.main.module.content.detail', ['ui.bootstrap', 'cgBusy']);
  /** Controller */
  detail.controller('detailController', [
    '$scope', 'detailService', '$stateParams', 'uibDateParser', '$rootScope',
    function ($scope, detailService, $stateParams, uibDateParser, $rootScope) {
      var vm = this;
      $rootScope.mname = $stateParams.mname;
      setTimeout(function () {
        $('.menu-label').removeClass('m-collapse');
      }, 600);
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
      $scope.promiseMain = detailService.getContent({
        menuId: $stateParams.pid
      }).then(function (result) {
        vm.dcontent = _.sortBy(result.data, ['picCode']);
        _.forEach(vm.dcontent, function (item) {
          var popup = {};
          popup.opened = false;
          popup.url = item.url;
          popup.picCode = item.picCode;
          $scope.popups.push(popup);

        });
      })

      $scope.open = function (index) {
        $scope.popups[index].opened = true;
      };

      $scope.changed = function (index) {
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
  detail.factory('detailService', ['$http', 'URL',
    function ($http, URL) {
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
    function (detailService, $window) {
      return {
        restrict: 'ACE',
        scope: {
          content: '='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function (scope, element, attrs) {
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
          scope.$watch('content.model', function (newValue, oldValue) {
            if (newValue === oldValue || !newValue || !oldValue) {
              return;
            } // AKA first run
            drawChart();
          });

          scope.$watch('content.quarter', function (newValue, oldValue) {
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
            scope.content.promise = detailService.getDetail(scope.content.url, {
              queryTime: getDateFormat(timeParam, timeFormatParam),
              picCode: scope.content.picCode
            }).then(function (result) {
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


                var screen_width = screen.width;
                var label_show = true;
                if (screen_width < 1200) {
                  label_show = false;
                }
                opt.yAxis = [];
                _.forEach(opt.y_name, function (item, index) {

                  var yAxis = {};
                  yAxis.type = 'value';
                  yAxis.name = item;
                  yAxis.axisTick = {};
                  yAxis.axisTick.inside = true;

                  if (opt.max_and_min && opt.max_and_min[index]) {
                    var minValue = Number(opt.max_and_min[index].minValue);
                    var maxValue = Number(opt.max_and_min[index].maxValue);
                    if (minValue >= 0 && minValue < 1) {
                      minValue = 0;
                    } else {
                      minValue = minValue - 1;
                    }
                    if (maxValue < 5) {
                      maxValue = 4;
                    }
                    maxValue = 1 + maxValue;
                    yAxis.min = Math.round(minValue);
                    yAxis.max = Math.round(maxValue);
                  }
                  yAxis.splitBumber = 5;
                  yAxis.interval = (yAxis.max - yAxis.min) / yAxis.splitBumber;
                  yAxis.axisLine = {
                    onZero: false
                  };
                  yAxis.axisLabel = {};
                  yAxis.axisLabel.formatter = function (value) {
                    if (((value + '').indexOf('.') != -1)) {
                      return value.toFixed(0);
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
                    option.series[1].label.normal.formatter = function (obj) {
                      var percentShow = '';

                      var labelShow = '\n\n' + obj.data.name + '\n';
                      if (screen_width >= 1200) {
                        if (obj.data.other && obj.data.other.length > 1) {
                          for (var i = 0; i < obj.data.other.length; i++) {
                            labelShow += obj.data.other[i].name + ":" + obj.data.other[i].value + obj.data.other[i].unit + '\n';
                          }
                        } else {
                          labelShow = obj.data.name + ":" + obj.data.value + obj.data.unit + '\n';
                          if (opt.auto_count && opt.auto_count == 'percent') {
                            labelShow += '占比：' + obj.percent + '%';
                          }
                        }
                      }



                      return labelShow;
                    }
                    option.series[1].radius = ['26%', '48%'];
                  }
                  option.tooltip = {
                    trigger: 'item',
                    position:'top',
                    formatter: function (obj) {
                      var labelShow = obj.data.name + '<br/>';
                      if (obj.data.other && obj.data.other.length > 1) {
                        for (var i = 0; i < obj.data.other.length; i++) {
                          labelShow += obj.data.other[i].name + ":" + obj.data.other[i].value + obj.data.other[i].unit + '<br/>';
                        }
                      } else {
                        labelShow = obj.data.name + ":" + obj.data.value + opt.y_name[0] + '<br/>';
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
                  option.series[0].label.normal.textStyle = {
                    color: '#333'
                  };
                  if (option.series.length == 1) {
                    option.series[0].label.normal.position = 'outside';
                  }
                  option.series[0].label.normal.formatter = '{b}\n {c}' + opt.y_name[0];
                  // option.series[0].label.normal.textStyle = {
                  //   color: "#333"
                  // };
                  if (scope.content.picCode == '1231') {
                    option.series[1].startAngle = 120;
                  }
                } else
                if (opt.series[0].type == 'radar') {
                  var indicators = [];
                  _.forEach(opt.x_data, function (item, index) {
                    var indicator = {};
                    indicator.name = item;
                    var max = 0;
                    var min = 0;
                    if (opt.series[0].data.length == 1) {
                      var dataArray = _.map(opt.series[0].data, 'value')[0];
                      max = Number(dataArray[index]);
                      min = Number(dataArray[index]);
                      _.forEach(dataArray[0], function (data, index2) {
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
                      _.forEach(dataArray, function (data, index2) {
                        dataAll = _.concat(data, dataAll);
                      });
                      max = Number(dataAll[0]);
                      min = Number(dataAll[0]);
                      _.forEach(dataAll, function (data) {
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
                  _.forEach(opt.series[0].data, function (data, index) {
                    var trueValue = angular.copy(data.value);
                    data.trueValue = trueValue;
                    _.forEach(data.value, function (value, index2) {
                      data.value[index2] = _.toNumber(value);;
                    })
                  })
                  // 避免出现不同分类相差值太大，不能在雷达图中体现倾向，按各分类与最大值的比例扩大较小的分类值，但鼠标滑过时，显示真实值
                  _.forEach(opt.series[0].data, function (data, index) {
                    var item_max = _.max(data.value);
                    if (indicators[0].max > item_max) {
                      var discuss = parseInt(indicators[0].max / item_max);
                      _.forEach(data.value, function (value, index2) {
                        data.value[index2] = (value * discuss).toFixed(2);
                      })
                    }
                  });
                  option.color = colors;
                  option.tooltip = {
                    position:'top',
                    formatter: function (data) {
                      var text = data.name + "<br/>";
                      _.forEach(opt.x_data, function (item, index) {
                        text += item + ":" + data.data.trueValue[index] + "<br/>";
                      })
                      return text;
                    }
                  };
                  option.legend = {
                    top: 'bottom',
                    bottom: 20,
                    data: opt.legend,
                    textStyle: {
                      fontSize: 14,
                      fontWeight: 'bolder'
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
                  if (screen_width < 1200) {
                    option.radar.name.formatter = function (val) {
                      var char_length = val.length;
                      var newstr = '';
                      if (char_length > 4) {
                        var strTemp = '';
                        var leftStr = '';
                        //for(var i=0; i<(char_length/5); i++) {
                        //if(i != 0) {
                        strTemp = val.substring(0, char_length - 4);
                        if (strTemp.length > 8) {
                          var temp1 = strTemp.substring(0, strTemp.length - 4);
                          var temp2 = strTemp.substring(strTemp.length - 4);
                          strTemp = temp1 + '\n' + temp2;
                        }
                        leftStr = val.substring(char_length - 4);
                        newstr = strTemp + '\n' + leftStr;
                        //}
                        //}
                      } else {
                        newstr = val;
                      }
                      return newstr;
                    }
                  }
                  option.radar.nameGap = 8;
                  option.radar.radius = '60%';
                  if (screen_width < 1200) {
                    option.radar.radius = '45%';
                  }
                  option.radar.indicator = indicators;
                  if (scope.content.picCode == '2321') {
                    option.radar.startAngle = 162;
                  }
                  option.series = opt.series;
                } else {
                  var stack_name = '';
                  var labelPos = 'top';
                  var axisLabel = {};
                  var grid_btm = 70;
                  if (screen_width < 1200) {
                    grid_btm = 90;
                  }
                  if (opt.need_group == "1") {
                    stack_name = 'group';
                    labelPos = 'inside';
                    colors = group_colors;
                  }
                  if (opt.series[0].data.length > 10) {
                    axisLabel = {
                      interval: 0,
                      formatter: function (val, index) {
                        if (val.indexOf('月') > -1) {
                          if (screen_width < 1200 && index % 2 != 0) {
                            val = '\n' + val;
                          }
                          return val;
                        }
                        return val.split("").join("\n"); //横轴信息文字竖直显示
                      }

                    };
                  } else {
                    if (opt.series[0].data.length > 4 && screen_width < 1200) {
                      axisLabel = {
                        interval: 0,
                        formatter: function (val, index) {
                          if (index % 2 != 0) {
                            val = '\n' + val;
                          }
                          return val;
                        }

                      };
                    }
                  }
                  axisLabel.interval = 0;
                  axisLabel.textStyle = {
                    fontWeight: 'bolder'
                  };
                  if (screen_width < 1200) {
                    axisLabel.textStyle = {
                      fontWeight: 'normal'
                    };
                  }
                  _.forEach(opt.series, function (item, index) {
                    item.label = {
                      normal: {
                        show: label_show,
                        position: labelPos,
                        textStyle: {
                          // color: '#333',
                          fontSize: 12
                        }
                      }
                    };
                    if (scope.content.picCode == '4211' || scope.content.picCode == '4221' || scope.content.picCode == '4231') {
                      item.label.normal = {
                        show: false
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
                        } else {
                          item.label = {
                            normal: {
                              show: label_show,
                              position: labelPos,
                              textStyle: {
                                // color: '#333',
                                fontSize: 12,
                                fontWeight: 'bolder'
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
                        _.forEach(item.data, function (idata, dataIndex) {
                          if (dataIndex == 0) {
                            idata.label = {
                              normal: {
                                show: label_show,
                                textStyle: {
                                  // color: colors[2],
                                  fontWeight: 'bolder'
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

                      _.forEach(item.data, function (data) {
                        if (data.name && data.name.length > 5 && item.data.length > 12) { // 字符长度大于5
                          if (scope.content.picCode == '2322') {
                            grid_btm = 100;
                            if (screen_width < 1200) {
                              grid_btm = 120;
                            }
                          } else {
                            grid_btm = 190;
                            if (screen_width < 1200) {
                              grid_btm = 210;
                            }
                          }
                        }
                      })
                    }

                    item.connectNulls = true;
                    //  item.label = label;
                    item.stack = stack_name;

                  });

                  var grid_left = '10%';
                  var grid_right = '10%';
                  var grid_top = '15%';
                  if (screen_width < 1600) {
                    if (screen_width < 1200) {
                      grid_left = '16%';
                      grid_right = '14%';
                      grid_top = '18%';
                    } else {
                      grid_left = '15%';
                      grid_right = '15%';
                    }

                  }
                  option = {
                    color: colors,
                    title: {
                      text: opt.title,
                      left: 'center',
                      top: -4
                    },
                    tooltip: {
                      trigger: 'axis',
                      position: function (point, params, dom) {
                        console.log(screen_width);
                        console.log($(dom).outerWidth());
                        if(screen_width*0.56 < $(dom).outerWidth()) { // 悬浮框宽度大于屏幕宽度56%
                          return ['20%', '40%'];
                        }
                        if(params[0].dataIndex >= (opt.x_data.length/2)) {
                          return [point[0]-$(dom).outerWidth(), '40%'];
                        }
                        // 固定在顶部
                        return [point[0], '40%'];
                      },
                    },
                    legend: {
                      top: 'bottom',
                      bottom: 20,
                      data: opt.legend,
                      textStyle: {
                        fontSize: 14,
                        fontWeight: 'bolder'
                      }
                    },
                    grid: {
                      bottom: grid_btm,
                      top: grid_top,
                      left: grid_left,
                      right: grid_right
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
                    _.forEach(opt.series[0].data, function (serData, index) {
                      var dataObj = {};
                      dataObj.rowName = serData.name;
                      var cellDatas = [];
                      _.forEach(serData.trueValue, function (data) {
                        var cellData = {};
                        cellData.value = data;
                        cellDatas.push(cellData);
                      })
                      dataObj.rowValue = cellDatas;
                      rowDatas.push(dataObj);
                    });
                  } else {
                    _.forEach(opt.legend, function (legendData, index) {
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
                  _.forEach(opt.x_data, function (item, index) {
                    var dataObj = {};
                    dataObj.rowName = item;
                    var cellDatas = [];
                    if (opt.series[0].type == 'radar') {
                      _.forEach(opt.series[0].data, function (serData, index2) {
                        var cellData = {};
                        cellData.name = serData.name;
                        cellData.value = serData.trueValue[index];
                        cellDatas.push(cellData);
                      });
                    } else {
                      _.forEach(opt.series, function (serData, index2) {
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
                  }).then(function (res) {
                    scope.content.rowData = res.data;
                  })
                } else {
                  detailService.getTableData(opt.table_url, {
                    picCode: scope.content.picCode,
                    queryTime: getDateFormat(timeParam, timeFormatParam)
                  }).then(function (res) {
                    scope.content.columnNames = _.map(res.data.rowData[0].rowValue, 'name');

                    scope.content.rowData = res.data.rowData;
                  })
                }

                if (scope.content.picCode == '4112') { // 全市服务业企业登记情况,特殊处理
                  var enTotal = opt.series[0].data;
                  var enNum = opt.series[1].data;
                  if (screen_width > 1200) {
                    element.find('div')[0].innerHTML = '<div class="item-wrap">' +
                      '<h3 class="chart-title" style="margin-top: 0;">' + opt.title + '</h3>' +
                      '<div class="chart-item"><div class="item"><div class="pic pic-home"><i class="fa fa-home"></i></div></div><div class="item"><div class="pic pic-home"><i class="fa fa-rmb"></i></div></div></div>' +
                      '<div class="chart-item"><div class="item"><div class="content-item">' + enTotal[0].name + "：" + enTotal[0].value + enTotal[0].unit + '</div></div><div class="item"><div class="content-item">' + opt.series[1].name + "：" + enNum[0].value + enNum[0].unit + '</div></div></div>' +
                      '<div class="chart-item"><div class="item"><div class="content-item">' + enTotal[1].name + "：" + enTotal[1].value + enTotal[1].unit + '</div></div><div class="item"><div class="content-item">' + opt.series[1].name + "：" + enNum[1].value + enNum[1].unit + '</div></div></div>' +
                      '<div class="chart-item"><div class="item"><div class="content-item">' + enTotal[2].name + "：" + enTotal[2].value + enTotal[2].unit + '</div></div><div class="item"><div class="content-item">' + opt.series[1].name + "：" + enNum[2].value + enNum[2].unit + '</div></div></div>' +
                      '<div>';
                  } else {
                    element.find('div')[0].innerHTML = '<div class="item-wrap">' +
                      '<h3 class="chart-title" style="margin-top: 0;">' + opt.title + '</h3>' +
                      '<div class="chart-item"><div class="item"><div class="pic pic-home"><i class="fa fa-home"></i></div></div><div class="item"><div class="pic pic-home"><i class="fa fa-rmb"></i></div></div></div>' +
                      '<div class="chart-item"><div class="item"><div class="content-item">' + enTotal[0].name + "：<br/>" + enTotal[0].value + enTotal[0].unit + '</div></div><div class="item"><div class="content-item">' + opt.series[1].name + "：<br/>" + enNum[0].value + enNum[0].unit + '</div></div></div>' +
                      '<div class="chart-item"><div class="item"><div class="content-item">' + enTotal[1].name + "：<br/>" + enTotal[1].value + enTotal[1].unit + '</div></div><div class="item"><div class="content-item">' + opt.series[1].name + "：<br/>" + enNum[1].value + enNum[1].unit + '</div></div></div>' +
                      '<div class="chart-item"><div class="item"><div class="content-item">' + enTotal[2].name + "：<br/>" + enTotal[2].value + enTotal[2].unit + '</div></div><div class="item"><div class="content-item">' + opt.series[1].name + "：<br/>" + enNum[2].value + enNum[2].unit + '</div></div></div>' +
                      '<div>';
                  }

                } else {
                  setTimeout(function () {
                    var screen_height = screen.height;
                    var main_height = $('.mobile-content').height();
                    if (screen_width < 1200) { // mobile
                      $('.mobile-content').css({
                        'min-height': screen_height + 'px'
                      });

                      if (main_height <= screen_height) {
                        if (screen_height > 980) {
                          $('.mobile-content .content-main').css({
                            'min-height': (screen_height - 50) + 'px'
                          }); // 50为header的高度
                          $('.mobile-content .graph>div').css({
                            'height': (screen_height / $('.mobile-content .content-box').length - 20 - 44 - 50) + 'px'
                          }); // 50为header的高度
                        } else {
                          $('.mobile-content .content-main').css({
                            'min-height': (screen_height - 50) + 'px'
                          }); // 50为header的高度
                          $('.mobile-content .graph>div').css({
                            'min-height': (screen_height - 50 - 40 - 46 - 2 - 10) + 'px'
                          }); // 50为header的高度,40为菜单项高度,46为统计时间和部门高度,2为chartborder，10为graph边距

                        }
                      }
                    }
                    chartInstance = echarts.init((element.find('div'))[0]);
                    //element.find('div')[0].style.height = $('.graph').height() + 'px';
                    chartInstance.clear();
                    chartInstance.resize();
                    chartInstance.setOption(option);




                  }, 600);
                }

              }

            });
          }

          scope.onResize = function () {
            if (chartInstance) {
              chartInstance.resize();
            }
          }

          angular.element($window).bind('resize', function () {
            scope.onResize();
          })


        }
      }
    }
  ]);


})();