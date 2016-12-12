(function() {
  /** Module */
  var eco = angular.module('app.profile.eco', []);
  eco.$inject = ['$location'];
  /** Controller */
  eco.controller('ecoController', [
    '$scope', 'ecoService','$state','$stateParams',
    function($scope, ecoService,$state,$stateParams) {
      var vm = this;
      $scope.chartlist = [];

      ecoService.getContent({
        menuId: 7
      }).then(function(result) {
        vm.dashcontent = _.sortBy(result.data, ['picCode']);
        _.forEach(vm.dashcontent, function(item) {
          var chart = {};
          chart.opened = false;
          chart.url = item.url;
          chart.picCode = item.picCode;
          $scope.chartlist.push(chart);
        });
      });

      ecoService.getEcoData({
        picCode: 7117
      }).then(function(result) {
        vm.ecoData = result.data;
      })

      ecoService.getEcoData({
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
  eco.factory('ecoService', ['$http', 'URL',
    function($http, URL) {
      return {
        getMenus: getMenus,
        getDetail: getDetail,
        getContent: getContent,
        getDateFormat: getDateFormat,
        getEcoData: getEcoData
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

      function getEcoData(params) {
        return $http.get(
          URL + '/identity/table', {
            params: params
          }
        )
      }
    }
  ]);

  eco.directive('dashChartEtotal', ['ecoService', '$window',
    function(ecoService, $window) {
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
          ecoService.getDetail(scope.econtent.url, {
            queryTime: ecoService.getDateFormat(scope.econtent.model, scope.econtent.format),
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
            scope.econtent.dep_name = opt.dep_name;
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

            _.forEach(opt.series[1].data,function(data){

            });


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
                    labelShow = obj.data.name + ":" + obj.data.value + opt.y_name[0] +'<br/>';
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
                      return obj.data.name + '\n' + obj.data.value + opt.y_name[0];
                    },
                    //formatter: '{b}\n {c}亿元',
                    textStyle: {
                      color: '#FFF'
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
                    color: 'rgba(255,255,255,0)'
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
                    textStyle:{
                      color: '#FFF'
                    }
                  }
                },
                radius: ['25%', '50%'],
                data: opt.series[1].data
              }]
            };
            // set labelLine style
            var screen_width = screen.width;
            if(screen_width < 1600) {
              option.series[1].labelLine = {normal:{
                  length:14,
                  length2:4
              }};
              option.series[1].label.normal.textStyle = {
                color: '#FFF',
                fontSize:10
              };
            }

            //chartInstance1 = echarts.init((element.find('div'))[0]);
          //  chartInstance1.setOption(option);
            setTimeout(function() {
              chartInstance1 = echarts.init((element.find('div'))[0]);
              //element.find('div')[0].style.height = $('.graph').height() + 'px';
              chartInstance1.clear();
              chartInstance1.resize();
              chartInstance1.setOption(option);
            }, 600);

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

  eco.directive('dashChartIncrease', ['ecoService', '$window',
    function(ecoService, $window) {
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
          ecoService.getDetail(scope.icontent.url, {
            queryTime: ecoService.getDateFormat(scope.icontent.model, scope.icontent.format),
            picCode: scope.icontent.picCode
          }).then(function(result) {
            var opt = result.data;
            if (!opt || !opt.series) {
              return;
            }
            scope.icontent.query_time = opt.init_query_time;
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
                    labelShow = obj.data.name + ":" + obj.data.value + obj.data.unit+ '<br/>';
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
                      return "\n" + obj.data.name + "\n" + obj.data.value+ obj.data.unit + '\n';
                    },
                    textStyle: {
                      color:'#FFF'
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
                    color: 'rgba(255,255,255,0)'
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
                    },
                    textStyle: {
                      color:'#FFF'
                    }
                  }
                },
                radius: ['25%', '50%'],
                data: opt.series[1].data
              }]
            };
            // set labelLine style
            var screen_width = screen.width;
            if(screen_width < 1600) {
              option.series[1].labelLine = {normal:{
                  length:10,
                  length2:8
              }};
              option.series[1].label.normal.textStyle = {
                color: '#FFF',
                fontSize:10
              };
            }
            // chartInstance2 = echarts.init((element.find('div'))[0]);
            // chartInstance2.setOption(option);
            setTimeout(function() {
              chartInstance2 = echarts.init((element.find('div'))[0]);
              //element.find('div')[0].style.height = $('.graph').height() + 'px';
              chartInstance2.clear();
              chartInstance2.resize();
              chartInstance2.setOption(option);
            }, 600);

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

  eco.directive('dashChartInvest', ['ecoService', '$window',
    function(ecoService, $window) {
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
          ecoService.getDetail(scope.vcontent.url, {
            queryTime: ecoService.getDateFormat(scope.vcontent.model, scope.vcontent.format),
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


            var colors = ['rgb(255,169,34)', 'rgb(0,152,72)', 'rgb(0,168,228)', 'rgba(0, 120, 215, 0.6)', 'rgba(0, 120, 215, 0.06)'];
            var areaColors = ['rgb(0,168,228)', 'rgb(107,217,95)', 'rgba(14, 83, 108, 0.5)', 'rgba(0,204,200,0.5)'];
            opt.yAxis = [];
            _.forEach(opt.y_name, function(item, index) {
              var yAxis = {};
              yAxis.type = 'value';
              yAxis.name = item;
              yAxis.axisLabel = {
                textStyle:{
                  color:'rgb(0,168,228)'
                }
              };
              yAxis.axisTick = {};
              yAxis.axisTick.inside = true;
              yAxis.axisLine = {lineStyle: {
                color: colors[2],
                shadowColor: colors[2],
                shadowBlur: 4
              }};
              yAxis.splitLine = {
                show: true,
                interval: 'auto',
                lineStyle: {
                  color: colors[3]
                }
              };
              yAxis.splitArea = {
                show: true,
                areaStyle: {
                  color: colors[4]
                }
              };
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
                    color:'#FFF'
                  }
                }
              };
            });
            var screen_width = screen.width;
            var grid_top = '24%';
            var grid_left = '10%';
            if(screen_width < 1600) {
              grid_top = '36%';
              grid_left= '12%';
            }
            var option = {
              color: areaColors,
              title: {
                text: text.name + "：" + text.value + text.unit,
                subtext: subtext.name + "：" + subtext.value + subtext.unit,
                textStyle: {
                  fontSize: 12,
                  color: 'rgb(200,254,200)',
                },
                subtextStyle: {
                  fontSize: 12,
                  color: 'rgb(200,254,200)',
                  fontWeight: 'border'
                },
                itemGap: 10,
                padding: 4,
                backgroundColor: 'rgba(0, 120, 215, 0.5)'
              },
              grid:{
                top:grid_top,
                left:grid_left,
                right:grid_left,
                bottom:30
              },
              legend: {
                orient: 'vertical',
                left: 'right',
                data: opt.legend,
                textStyle:{
                  color:'#fbfbfb',
                  fontSize:12
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
                    color: colors[2],
                    shadowColor: colors[2],
                    shadowBlur: 4
                  }
                },
                axisLabel:{
                  interval: 0,
                  textStyle:{
                    fontSize:10,
                    color:'rgb(0,168,228)'
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

            // chartInstance3 = echarts.init((element.find('div'))[0]);
            // chartInstance3.setOption(option);

            setTimeout(function() {
              chartInstance3 = echarts.init((element.find('div'))[0]);
              //element.find('div')[0].style.height = $('.graph').height() + 'px';
              chartInstance3.clear();
              chartInstance3.resize();
              chartInstance3.setOption(option);
            }, 600);

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

  eco.directive('dashChartCpi', ['ecoService', '$window',
    function(ecoService, $window) {
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
          ecoService.getDetail(scope.ccontent.url, {
            queryTime: ecoService.getDateFormat(scope.ccontent.model, scope.ccontent.format),
            picCode: scope.ccontent.picCode
          }).then(function(result) {
            var opt = result.data;
            if (!opt || !opt.series) {
              return;
            }
            scope.ccontent.query_time = opt.init_query_time;
            scope.ccontent.dep_name = opt.dep_name;
            var yAxis_min = 0;
            var yAxis_max = 0;
            if(opt.max_and_min){
              yAxis_min = Math.round(opt.max_and_min[0].minValue);
              yAxis_max = Math.round(opt.max_and_min[0].maxValue);
            }
            var screen_width = screen.width;
            var grid_top = '24%';
            var grid_left = '10%';
            if(screen_width < 1600) {
              grid_top = '32%';
              grid_left= '16%';
            }
            var colors = ['rgb(255,169,34)', 'rgb(0,152,72)', 'rgb(0,168,228)', 'rgba(0, 120, 215, 0.6)', 'rgba(0, 120, 215, 0.06)'];
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
                  color:'#d5e2df',
                  fontSize:12
                }
              },
              grid:{
                //right:'3%',
                top:'24%',
                left:grid_left,
                bottom:30
              },
              xAxis: {
                type: 'category',
                boundaryGap: false,
                data: opt.x_data,
                axisLine: {
                  lineStyle: {
                    color: colors[2],
                    shadowColor: colors[2],
                    shadowBlur: 4
                  }
                },
                axisLabel:{
                  interval: 0,
                  textStyle:{
                    fontSize:10
                  },
                  formatter:function(value){
                    var month = value.substring(value.indexOf('-')+1);
                    return Number(month) + '月';
                  }
                },
                splitLine: {
                  show: true,
                  interval: 0,
                  lineStyle: {
                    color: colors[3]
                  }
                },
                splitArea: {
                  show: true,
                  areaStyle: {
                    color: colors[4]
                  }
                }
              },
              yAxis: {
                type: 'value',
                axisLabel: {
                  formatter: '{value}'
                },
                name:opt.y_name,
                min:yAxis_min,
                max:yAxis_max,
                splitBumber:5,
                interval:(yAxis_max-yAxis_min)/5,
                axisLine: {
                  lineStyle: {
                    color: colors[2],
                    shadowColor: colors[2],
                    shadowBlur: 4
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
                }
              },
              series: opt.series
            };

            // chartInstance4 = echarts.init((element.find('div'))[0]);
            // chartInstance4.setOption(option);

            setTimeout(function() {
              chartInstance4 = echarts.init((element.find('div'))[0]);
              //element.find('div')[0].style.height = $('.graph').height() + 'px';
              chartInstance4.clear();
              chartInstance4.resize();
              chartInstance4.setOption(option);
            }, 600);

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

  eco.directive('dashChartConsume', ['ecoService', '$window',
    function(ecoService, $window) {
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
          ecoService.getDetail(scope.scontent.url, {
            queryTime: ecoService.getDateFormat(scope.scontent.model, scope.scontent.format),
            picCode: scope.scontent.picCode
          }).then(function(result) {
            var opt = result.data;
            if (!opt || !opt.series) {
              return;
            }
            scope.scontent.query_time = opt.init_query_time;
            scope.scontent.dep_name = opt.dep_name;
            var text = {};
            var subtext = {};
            if (opt.dataItems && opt.dataItems[0]) {
              text = opt.dataItems[0];
            }
            if (opt.dataItems && opt.dataItems[1]) {
              subtext = opt.dataItems[1];
            }
            var colors = ['rgb(107,217,95)', 'rgb(0,168,228)', 'rgb(14, 83, 108)', 'rgb(0,204,200)'];
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
                    labelShow = obj.data.name + ":" + obj.data.value + opt.y_name[0] + '<br/>';
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
                left:'right',
                textStyle: {
                  fontSize: 12,
                  color: 'rgb(200,254,200)',
                },
                subtextStyle: {
                  fontSize: 12,
                  color: 'rgb(200,254,200)',
                  fontWeight: 'border'
                },
                itemGap: 10,
                padding: 4,
                backgroundColor: 'rgba(0, 120, 215, 0.5)'
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

                        var labelShow = '\n';
                        if (obj.data.other && obj.data.other.length > 1) {
                          for (var i = 0; i < obj.data.other.length; i++) {
                            labelShow += obj.data.other[i].name + ":" + obj.data.other[i].value + '\n';
                          }
                        } else {
                          var unit = opt.y_name[0]?opt.y_name[0]:'';
                          labelShow = obj.data.name + ":" + obj.data.value + unit +'\n';
                          if (opt.auto_count && opt.auto_count == 'percent') {
                            labelShow += '占比：' + obj.percent + '%';
                          }
                        }
                        return labelShow;
                      },
                      textStyle: {
                        color: "#FFF"
                      }
                    }
                  }
                },
                labelLine: {
                  show: true,
                  normal:{
                    length:14,
                    length2:8
                  }
                }
              }]
            };

            // chartInstance5 = echarts.init((element.find('div'))[0]);
            // chartInstance5.setOption(option);

            setTimeout(function() {
              var ecoHeight = $('.profile')[0].scrollHeight;
              $('.profile').css({'height':ecoHeight  + "px"});
              chartInstance5 = echarts.init((element.find('div'))[0]);
              //element.find('div')[0].style.height = $('.graph').height() + 'px';
              chartInstance5.clear();
              chartInstance5.resize();
              chartInstance5.setOption(option);
            }, 600);

            scope.onResize5 = function() {
              if (chartInstance5) {
                chartInstance5.resize();
              }
            }

            // var ecoHeight = $('.profile')[0].scrollHeight;
            // $('.profile').css({'height':ecoHeight  + "px"});
            // angular.element($window).bind('resize', function() {
            //   scope.onResize5();
            // })
          })
        }
      }
    }
  ]);


})();
