(function() {
  /** Module */
  var dashboard = angular.module('app.dashboard', []);
  dashboard.$inject = ['$location'];
  /** Controller */
  dashboard.controller('dashboardController', [
    '$scope', 'dashboardService',
    function($scope, dashboardService) {
      var vm = this;
      $scope.chartlist = [];

      dashboardService.getMenus({
        parentId: "0"
      }).then(function(result) {
        vm.menus = result.data;
        if (vm.menus && vm.menus[0] && vm.menus[0].id) {
          dashboardService.getContent({
            menuId: vm.menus[0].id
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
        }

      });

      dashboardService.getEcoData({
        picCode: 7117
      }).then(function(result) {
        vm.ecoData = result.data;
      })

      dashboardService.getEcoData({
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
  dashboard.factory('dashboardService', ['$http', 'URL',
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

  dashboard.directive('dashChartEtotal', ['dashboardService', '$window',
    function(dashboardService, $window) {
      return {
        restrict: 'ACE',
        scope: {
          econtent: '='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          var chartInstance1 = null;
          console.log(scope.econtent);
          if (!scope.econtent || !scope.econtent.url) {
            return;
          }
          dashboardService.getDetail(scope.econtent.url, {
            queryTime: dashboardService.getDateFormat(scope.econtent.model, scope.econtent.format),
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

            var colors = ['rgb(0,204,200)', 'rgb(240,119,129)', 'rgb(0,168,228)'];
            var option = {
              color: colors,
              tooltip: {
                trigger: 'item',
                formatter: function(obj) {
                  var percentShow = '';

                  var labelShow =  obj.data.name + '<br/>';
                  if (obj.data.other && obj.data.other.length > 1) {
                    for (var i = 0; i < obj.data.other.length; i++) {
                      labelShow += obj.data.other[i].name + ":" + obj.data.other[i].value + '<br/>';
                    }
                  } else {
                    labelShow = obj.data.name + ":" + obj.data.value + '<br/>';
                    if(opt.auto_count && opt.auto_count =='percent') {
                      labelShow += '占比：'+obj.percent+'%';
                    }
                  }
                  return labelShow;
                }
              },
              series: [{
                name: opt.series[0].name,
                type: 'pie',
                selectedMode: 'single',
                radius: [0, '30%'],

                label: {
                  normal: {
                    position: 'center',
                    // formatter : function(obj) {
                    //   var labelShow = obj.data.name + '\n';
                    //   for(var i=0; i<obj.data.other.length; i++) {
                    //     labelShow += obj.data.other[i].name + obj.data.other[i].value + obj.data.other[i].unit +'\n';
                    //   }
                    //   return labelShow;
                    // },
                    formatter: '{b}\n {c}亿',
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
                radius: ['30%', '55%'],
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

  dashboard.directive('dashChartIncrease', ['dashboardService', '$window',
    function(dashboardService, $window) {
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
          dashboardService.getDetail(scope.icontent.url, {
            queryTime: dashboardService.getDateFormat(scope.icontent.model, scope.icontent.format),
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

                  var labelShow =  obj.data.name + '<br/>';
                  if (obj.data.other && obj.data.other.length > 1) {
                    for (var i = 0; i < obj.data.other.length; i++) {
                      labelShow += obj.data.other[i].name + ":" + obj.data.other[i].value + '<br/>';
                    }
                  } else {
                    labelShow = obj.data.name + ":" + obj.data.value + '<br/>';
                    if(opt.auto_count && opt.auto_count =='percent') {
                      labelShow += '占比：'+obj.percent+'%';
                    }
                  }
                  return labelShow;
                }
              },
              series: [{
                name: opt.series[0].name,
                type: 'pie',
                selectedMode: 'single',
                radius: [0, '30%'],

                label: {
                  normal: {
                    position: 'center',
                    formatter: '{b}\n {c}',
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
                radius: ['30%', '55%'],
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

  dashboard.directive('dashChartInvest', ['dashboardService', '$window',
    function(dashboardService, $window) {
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
          dashboardService.getDetail(scope.vcontent.url, {
            queryTime: dashboardService.getDateFormat(scope.vcontent.model, scope.vcontent.format),
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
            var indicators = [];
            _.forEach(opt.x_data, function(item, index) {
              var indicator = {};
              indicator.name = item;
              var dataArray = _.map(opt.series[0].data, 'value');
              var max = Number(opt.series[0].data[0].value[index]);
              _.forEach(dataArray, function(data, index2) {
                if (Number(opt.series[0].data[index2].value[index]) > max) {
                  max = Number(opt.series[0].data[index2].value[index]);
                }
              });
              indicator.max = max + 100;
              indicators.push(indicator);
            });

            var colors = ['rgb(232, 215, 64)', 'rgb(154, 253, 138)', 'rgb(14, 83, 108)', 'rgb(0,204,200)'];
            var areaColors = ['rgba(232, 215, 64, 0.5)', 'rgba(154, 253, 138, 0.5)', 'rgba(14, 83, 108, 0.5)', 'rgba(0,204,200,0.5)'];
            _.forEach(opt.series[0].data, function(item, index) {
              item.itemStyle = {
                normal: {
                  color: colors[index],
                  borderType: 'dashed'
                }
              };
              item.areaStyle = {
                normal: {
                  opacity: 0.9,
                  color: areaColors[index]
                }
              }
            });
            var option = {
              tooltip: {},
              title: {
                text: text.name + "：" + text.value + text.unit,
                subtext: subtext.name + "：" + subtext.value + subtext.unit,
                textStyle: {
                  fontSize: 12,
                  color: colors[3],
                },
                subtextStyle: {
                  fontSize: 12,
                  color: colors[3],
                  fontWeight: 'border'
                },
                itemGap: 10,
                padding: 4,
                backgroundColor: 'rgba(0, 120, 215, 0.5)'
              },
              legend: {
                orient: 'vertical',
                left: 'right',
                data: opt.legend,
                textStyle:{
                  color:'#d5e2df'
                }
              },
              radar: {
                // shape: 'circle',
                indicator: indicators,
                radius:'68%',
                name: {
                  formatter: '{value}',
                  textStyle: {
                    color: '#d5e2df'
                  }
                }
              },
              series: [{
                name: opt.title,
                type: 'radar',
                symbol: 'circle',
                symbolSize: 2,
                areaStyle: {
                  normal: {}
                },
                data: opt.series[0].data
              }]
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

  dashboard.directive('dashChartCpi', ['dashboardService', '$window',
    function(dashboardService, $window) {
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
          dashboardService.getDetail(scope.ccontent.url, {
            queryTime: dashboardService.getDateFormat(scope.ccontent.model, scope.ccontent.format),
            picCode: scope.ccontent.picCode
          }).then(function(result) {
            var opt = result.data;
            if (!opt || !opt.series) {
              return;
            }
            scope.ccontent.query_time = opt.init_query_time;
            scope.ccontent.dep_name = opt.dep_name;
            _.forEach(opt.series, function(item) {
              item.label = {
                normal: {
                  show: true,
                  position: 'top'
                }
              };
            });
            var colors = ['rgb(255,169,34)', 'rgb(0,152,72)', 'rgb(0,168,228)', 'rgba(0, 120, 215, 0.6)', 'rgba(0, 120, 215, 0.06)'];
            var option = {
              color: colors,
              tooltip: {
                trigger: 'axis'
              },
              legend: {
                top: 'bottom',
                data: opt.legend,
                textStyle:{
                  color:'#d5e2df'
                }
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
              yAxis: {
                type: 'value',
                axisLabel: {
                  formatter: '{value}'
                },
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

  dashboard.directive('dashChartConsume', ['dashboardService', '$window',
    function(dashboardService, $window) {
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
          dashboardService.getDetail(scope.scontent.url, {
            queryTime: dashboardService.getDateFormat(scope.scontent.model, scope.scontent.format),
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
                formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              title: {
                text: text.name + "：" + text.value + text.unit,
                subtext: subtext.name + "：" + subtext.value + subtext.unit,
                left:'right',
                textStyle: {
                  fontSize: 12,
                  color: colors[3],
                },
                subtextStyle: {
                  fontSize: 12,
                  color: colors[3],
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

            var dashboardHeight = $('.dashboard')[0].scrollHeight;
            console.log(dashboardHeight);
            $('.dashboard').css({'height':dashboardHeight  + "px"});
            angular.element($window).bind('resize', function() {
              scope.onResize5();
            })
          })
        }
      }
    }
  ]);


})();
