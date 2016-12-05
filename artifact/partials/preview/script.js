(function() {
  /** preview */
  var preview = angular.module('app.main.preview', ['ui.bootstrap']);
  /** Controller */
  preview.controller('previewController', [
    '$scope', 'previewService', '$stateParams', '$state',
    function($scope, previewService, $stateParams, $state) {
      var vm = this;
      $scope.chartlist = [];
      previewService.getContent({
        menuId: $stateParams.preid
      }).then(function(result) {
        vm.content = _.sortBy(result.data, ['picCode']);
        _.forEach(vm.content, function(item) {
          var chart = {};
          chart.opened = false;
          chart.url = item.url;
          chart.picCode = item.picCode;
          $scope.chartlist.push(chart);
        });
      });

      previewService.getEcoData({
        picCode: 7117
      }).then(function(result) {
        vm.ecoData = result.data;
      })

      previewService.getEcoData({
        picCode: 7118
      }).then(function(result) {
        vm.ecoDataDown = result.data;
      })

      $scope.open = function(index) {
        $scope.chartlist[index].opened = true;
      };

      $scope.changed = function(index) {
        if (!angular.isDate($scope.chartlist[index].model) || isNaN($scope.chartlist[index].model.getTime())) {
          alert('请输入正确的日期格式！');
          return;
        }
      }
      $scope.altInputFormats = ['M!/d!/yyyy'];



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
  preview.factory('previewService', ['$http', 'URL',
    function($http, URL) {
      return {
        getDetail: getDetail,
        getContent: getContent,
        getDateFormat: getDateFormat,
        getEcoData: getEcoData
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

      function getEcoData(params) {
        return $http.get(
          URL + '/identity/table', {
            params: params
          }
        )
      }
    }
  ]);

  preview.directive('wiservChartEtotal', ['previewService', '$window',
    function(previewService, $window) {
      return {
        restrict: 'ACE',
        scope: {
          econtent: '='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          var chartInstance1 = null;
          if (!scope.econtent || !scope.econtent.url) {
            return;
          }
          previewService.getDetail(scope.econtent.url, {
            queryTime: previewService.getDateFormat(scope.econtent.model, scope.econtent.format),
            picCode: scope.econtent.picCode
          }).then(function(result) {
            var opt = result.data;
            if (!opt || !opt.series) {
              return;
            }
            if (!scope.econtent.model && opt.init_query_time != '') {
              scope.econtent.model = new Date(opt.init_query_time);
            }
            scope.econtent.query_time = opt.init_query_time;
            var dateOptions = {};
            dateOptions.formatYear = 'yyyy';
            if (opt.time_scope == 'year') {
              scope.econtent.format = 'yyyy';
              dateOptions.minMode = 'year';
              dateOptions.datepickerMode = 'year';
            }
            if (opt.time_scope == 'month') {
              scope.econtent.format = 'yyyy-MM';
              dateOptions.minMode = 'month';
              dateOptions.datepickerMode = 'month';
            }
            scope.econtent.dateOptions = dateOptions;
            scope.econtent.dep_name = opt.dep_name;
            opt.series[1].data[0].labelLine = {
              normal:{
                  length:24,
                  length2:8
              }
            };
            var colors = ['rgb(0,204,200)', 'rgb(240,119,129)', 'rgb(0,168,228)'];
            var option = {
              color: colors,
              tooltip: {
                trigger: 'item',
                formatter: function(obj) {
                  var percentShow = '';

                  var labelShow = obj.data.name + '<br/>';
                  if (obj.data.other && obj.data.other.length > 1) {
                    for (var i = 0; i < obj.data.other.length; i++) {
                      labelShow += obj.data.other[i].name + ":" + obj.data.other[i].value + obj.data.other[i].unit +'<br/>';
                    }
                  } else {
                    labelShow = obj.data.name + ":" + obj.data.value + '亿元<br/>';
                    if (opt.auto_count && opt.auto_count == 'percent') {
                      labelShow += '占比：' + obj.percent + '%';
                    }
                  }
                  return labelShow;
                }
              },
              series: [{
                name: opt.series[0].name,
                type: 'pie',
                selectedMode: 'single',
                radius: [0, '25%'],

                label: {
                  normal: {
                    position: 'center',
                    formatter: '{b}\n {c}亿元',
                    textStyle: {
                      color: '#333'
                    }
                  }
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                itemStyle: {
                  normal: {
                    color: '#FFF'
                  }
                },
                data: opt.series[0].data
              }, {
                name: opt.series[1].name,
                type: 'pie',
                label: {
                  normal: {
                    formatter: function(obj) {
                      var percentShow = '';

                      var labelShow = '\n\n' + obj.data.name + '\n';
                      if (obj.data.other && obj.data.other.length > 1) {
                        for (var i = 0; i < obj.data.other.length; i++) {
                          labelShow += obj.data.other[i].name + ":" + obj.data.other[i].value + obj.data.other[i].unit +'\n';
                        }
                      } else {
                        labelShow = obj.data.name + ":" + obj.data.value + '\n';
                        if (opt.auto_count && opt.auto_count == 'percent') {
                          labelShow += '占比：' + obj.percent + '%';
                        }
                      }
                      return labelShow;
                    },
                    textStyle: {
                      fontSize: '8'
                    }
                  }
                },
                labelLine:{
                  normal:{
                      length:10,
                      length2:0
                  }
                },
                radius: ['25%', '50%'],
                data: opt.series[1].data
              }]
            };

            chartInstance1 = echarts.init((element.find('div'))[0]);
            chartInstance1.setOption(option);

            scope.onResize1 = function() {
              if (chartInstance1) {
                chartInstance1.resize();
              }
            }

            angular.element($window).bind('resize', function() {
              scope.onResize1();
            })
          })
        }
      }
    }
  ]);

  preview.directive('wiservChartIncrease', ['previewService', '$window',
    function(previewService, $window) {
      return {
        restrict: 'ACE',
        scope: {
          icontent: '='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          var chartInstance2 = null;
          if (!scope.icontent || !scope.icontent.url) {
            return;
          }
          previewService.getDetail(scope.icontent.url, {
            queryTime: previewService.getDateFormat(scope.icontent.model, scope.icontent.format),
            picCode: scope.icontent.picCode
          }).then(function(result) {
            var opt = result.data;
            if (!opt || !opt.series) {
              return;
            }
            scope.icontent.query_time =opt.init_query_time;
            scope.icontent.dep_name = opt.dep_name;
            var colors = ['rgb(0,204,200)', 'rgb(232,175,64)', 'rgb(0,168,228)'];
            var option = {
              color: colors,
              tooltip: {
                trigger: 'item',
                formatter: function(obj) {
                  var percentShow = '';

                  var labelShow = obj.data.name + '<br/>';
                  if (obj.data.other && obj.data.other.length > 1) {
                    for (var i = 0; i < obj.data.other.length; i++) {
                      labelShow += obj.data.other[i].name + ":" + obj.data.other[i].value + obj.data.other[i].unit +'<br/>';
                    }
                  } else {
                    labelShow = obj.data.name + ":" + obj.data.value + obj.data.unit + '<br/>';
                    if (opt.auto_count && opt.auto_count == 'percent') {
                      labelShow += '占比：' + obj.percent + '%';
                    }
                  }
                  return labelShow;
                }
              },
              series: [{
                name: opt.series[0].name,
                type: 'pie',
                selectedMode: 'single',
                radius: [0, '25%'],

                label: {
                  normal: {
                    position: 'center',
                    formatter: function(obj) {
                      return obj.data.name + "\n" + obj.data.value+ obj.data.unit + '\n';
                    },
                    textStyle: {
                      color: '#333'
                    }
                  }
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                itemStyle: {
                  normal: {
                    color: '#FFF'
                  }
                },
                data: opt.series[0].data
              }, {
                name: opt.series[1].name,
                type: 'pie',
                label: {
                  normal: {
                    formatter: function(obj) {
                      var percentShow = '';

                      var labelShow = '\n\n' + obj.data.name + '\n';
                      if (obj.data.other && obj.data.other.length > 1) {
                        for (var i = 0; i < obj.data.other.length; i++) {
                          labelShow += obj.data.other[i].name + "\n" + obj.data.other[i].value + obj.data.other[i].unit +'\n';
                        }
                      } else {
                        labelShow = obj.data.name + "\n" + obj.data.value + obj.data.unit+ '\n';
                        if (opt.auto_count && opt.auto_count == 'percent') {
                          labelShow += '占比：' + obj.percent + '%';
                        }
                      }
                      return labelShow;
                    }
                  }
                },
                radius: ['25%', '50%'],
                data: opt.series[1].data
              }]
            };

            chartInstance2 = echarts.init((element.find('div'))[0]);
            chartInstance2.setOption(option);

            scope.onResize2 = function() {
              if (chartInstance2) {
                chartInstance2.resize();
              }
            }

            angular.element($window).bind('resize', function() {
              scope.onResize2();
            })
          })
        }
      }
    }
  ]);

  preview.directive('wiservChartInvest', ['previewService', '$window',
    function(previewService, $window) {
      return {
        restrict: 'ACE',
        scope: {
          vcontent: '='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          var chartInstance3 = null;
          if (!scope.vcontent || !scope.vcontent.url) {
            return;
          }
          previewService.getDetail(scope.vcontent.url, {
            queryTime: previewService.getDateFormat(scope.vcontent.model, scope.vcontent.format),
            picCode: scope.vcontent.picCode
          }).then(function(result) {
            var opt = result.data;
            if (!opt || !opt.series) {
              return;
            }
            scope.vcontent.query_time = opt.init_query_time;
            scope.vcontent.dep_name = opt.dep_name;
            var text = {};
            var subtext = {};
            if (opt.dataItems && opt.dataItems[0]) {
              text = opt.dataItems[0];
            }
            if (opt.dataItems && opt.dataItems[1]) {
              subtext = opt.dataItems[1];
            }

            var colors = ['rgb(232, 215, 64)', 'rgb(154, 253, 138)', 'rgb(14, 83, 108)'];
            var areaColors = ['rgb(0,168,228)', 'rgb(0,152,72)', 'rgba(14, 83, 108, 0.5)'];
            opt.yAxis = [];
            _.forEach(opt.y_name, function(item, index) {
              var yAxis = {};
              yAxis.scale = true;
              yAxis.interval = 18;
              yAxis.type = 'value';
              yAxis.name = item;
              yAxis.axisLabel = {
                textStyle:{
                  color:'#333'
                }
              };
              yAxis.axisTick = {};
              yAxis.axisTick.inside = true;
              // yAxis.axisLine = {lineStyle: {
              //   color: colors[2]
              // }};
              yAxis.splitLine = {
                show: true,
                interval: 'auto'
              };
              if (opt.max_and_min) {
                if(opt.max_and_min[index].minValue<0 || (opt.max_and_min[index].minValue>0 && opt.max_and_min[index].minValue<1)){
                  opt.max_and_min[index].minValue = Number(opt.max_and_min[index].minValue)-1;
                }
                if(opt.max_and_min[index].maxValue<0 || (opt.max_and_min[index].maxValue>0 && opt.max_and_min[index].maxValue<1)) {
                  console.log(opt.max_and_min[index].maxValue);
                  opt.max_and_min[index].maxValue = 1 + Number(opt.max_and_min[index].maxValue);
                }
                console.log(opt.max_and_min[index].maxValue);
                yAxis.min = Math.round(opt.max_and_min[index].minValue);
                yAxis.max = Math.round(opt.max_and_min[index].maxValue);
              }
              opt.yAxis.push(yAxis);
            });
            _.forEach(opt.series, function(item) {
              if (item.type == 'bar') {
                item.barMaxWidth = '20%';
              }
              item.label = {
                normal: {
                  show: true,
                  position: 'top',
                  textStyle:{
                    color:'#333'
                  }
                }
              };
            });
            var option = {
              color: areaColors,
              title: {
                text: text.name + "：" + text.value + text.unit,
                subtext: subtext.name + "：" + subtext.value + subtext.unit,
                textStyle: {
                  fontSize: 12,
                  color: '#333',
                },
                subtextStyle: {
                  fontSize: 12,
                  color: '#333',
                  fontWeight: 'border'
                },
                itemGap: 10,
                padding: 4,
                borderColor: '#DDD',
                borderWidth: 1
              },
              grid:{
                top:'24%',
                bottom:30
              },
              legend: {
                orient: 'vertical',
                left: 'right',
                data: opt.legend,
                textStyle:{
                  color:'#333',
                  fontSize:14
                }
              },
              tooltip: {
                trigger: 'axis'
              },
              xAxis: [{
                type: 'category',
                axisTick: {
                  show: false
                },
                axisLine: {
                  lineStyle: {
                    color: colors[2]
                  }
                },
                axisLabel:{
                  interval: 0,
                  textStyle:{
                    fontSize:8,
                    color:'#333'
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
                },
                data: opt.x_data
              }],
              yAxis: opt.yAxis,
              series: opt.series
            };

            chartInstance3 = echarts.init((element.find('div'))[0]);
            chartInstance3.setOption(option);

            scope.onResize3 = function() {
              if (chartInstance3) {
                chartInstance3.resize();
              }
            }

            angular.element($window).bind('resize', function() {
              scope.onResize3();
            })
          })
        }
      }
    }
  ]);

  preview.directive('wiservChartCpi', ['previewService', '$window',
    function(previewService, $window) {
      return {
        restrict: 'ACE',
        scope: {
          ccontent: '='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          var chartInstance4 = null;
          if (!scope.ccontent || !scope.ccontent.url) {
            return;
          }
          previewService.getDetail(scope.ccontent.url, {
            queryTime: previewService.getDateFormat(scope.ccontent.model, scope.ccontent.format),
            picCode: scope.ccontent.picCode
          }).then(function(result) {
            var opt = result.data;
            if (!opt || !opt.series) {
              return;
            }
            scope.ccontent.dep_name = opt.dep_name;
            scope.ccontent.query_time = opt.init_query_time;
            var yAxis_min = 0;
            var yAxis_max = 0;
            if(opt.max_and_min){
              yAxis_min = Math.round(opt.max_and_min[0].minValue);
              yAxis_max = Math.round(opt.max_and_min[0].maxValue);
            }
            var colors = ['rgb(255,169,34)', 'rgb(0,152,72)', 'rgb(0,168,228)'];
            var option = {
              color: colors,
              tooltip: {
                trigger: 'axis'
              },
              legend: {
                orient: 'vertical',
                left: 'right',
                data: opt.legend,
                textStyle:{
                  color:'#333',
                  fontSize:14
                }
              },
              grid:{
                top:'24%',
                bottom:30
              },
              xAxis: {
                type: 'category',
                boundaryGap: false,
                data: opt.x_data,
                axisLabel:{
                  textStyle:{
                    fontSize:8
                  }
                },
              },
              yAxis: {
                type: 'value',
                min:yAxis_min,
                max:yAxis_max,
                axisLabel: {
                  formatter: '{value}'
                }
              },
              series: opt.series
            };

            chartInstance4 = echarts.init((element.find('div'))[0]);
            chartInstance4.setOption(option);

            scope.onResize4 = function() {
              if (chartInstance4) {
                chartInstance4.resize();
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

  preview.directive('wiservChartConsume', ['previewService', '$window',
    function(previewService, $window) {
      return {
        restrict: 'ACE',
        scope: {
          scontent: '='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          var chartInstance5 = null;
          if (!scope.scontent || !scope.scontent.url) {
            return;
          }
          previewService.getDetail(scope.scontent.url, {
            queryTime: previewService.getDateFormat(scope.scontent.model, scope.scontent.format),
            picCode: scope.scontent.picCode
          }).then(function(result) {
            var opt = result.data;
            scope.scontent.query_time = opt.init_query_time;
            scope.scontent.dep_name = opt.dep_name;
            if (!opt || !opt.series) {
              return;
            }
            var text = {};
            var subtext = {};
            if (opt.dataItems && opt.dataItems[0]) {
              text = opt.dataItems[0];
            }
            if (opt.dataItems && opt.dataItems[1]) {
              subtext = opt.dataItems[1];
            }
            var colors = ['rgb(107,217,95)', 'rgb(0,168,228)'];
            var option = {
              color: colors,
              tooltip: {
                trigger: 'item',
                formatter: function(obj) {
                  var percentShow = '';

                  var labelShow = obj.data.name + '<br/>';
                  if (obj.data.other && obj.data.other.length > 1) {
                    for (var i = 0; i < obj.data.other.length; i++) {
                      labelShow += obj.data.other[i].name + ":" + obj.data.other[i].value + '<br/>';
                    }
                  } else {
                    labelShow = obj.data.name + ":" + obj.data.value + '<br/>';
                    if (opt.auto_count && opt.auto_count == 'percent') {
                      labelShow += '占比：' + obj.percent + '%';
                    }
                  }
                  return labelShow;
                }
              },
              title: {
                text: text.name + "：" + text.value + text.unit,
                subtext: subtext.name + "：" + subtext.value + subtext.unit,
                left: 'right',
                textStyle: {
                  fontSize: 12
                },
                subtextStyle: {
                  fontSize: 12,
                  color: '#333',
                  fontWeight: 'border'
                },
                itemGap: 10,
                padding: 4,
                borderColor: '#DDD',
                borderWidth: 1
              },
              series: [{
                name: opt.series[0].name,
                type: 'pie',
                radius: '55%',
                center: ['50%', '50%'],
                startAngle: -230,
                data: opt.series[0].data,
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                },
                itemStyle: {
                  normal: {
                    label: {
                      show: true,
                      //	                            position:'inside',
                      formatter: function(obj) {
                        var percentShow = '';

                        var labelShow = '';
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
                    }
                  },
                  labelLine: {
                    show: true
                  }
                }
              }]
            };

            chartInstance5 = echarts.init((element.find('div'))[0]);
            chartInstance5.setOption(option);



            scope.onResize5 = function() {
              if (chartInstance5) {
                chartInstance5.resize();
              }
            }

            angular.element($window).bind('resize', function() {
              scope.onResize5();
            })
          })
        }
      }
    }
  ]);




})();
