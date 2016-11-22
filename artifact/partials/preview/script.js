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
        getDateFormat:getDateFormat
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
    }
  ]);

  preview.directive('wiservChartEtotal', ['previewService', '$window',
    function(previewService, $window) {
      return {
        restrict: 'ACE',
        scope:{
          econtent:'='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          var chartInstance1 = null;
          previewService.getDetail(scope.econtent.url,{
            queryTime: previewService.getDateFormat(scope.econtent.model, scope.econtent.format),
            picCode: scope.econtent.picCode
          }).then(function(result) {
            var opt = result.data;
            if(!opt || !opt.series) {
              return;
            }
            if (!scope.econtent.model && opt.init_query_time != '') {
              scope.econtent.model = new Date(opt.init_query_time);
            }

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
              color:colors,
              tooltip: {
                trigger: 'item',
                formatter: function(obj) {
                  var labelShow = obj.data.name + '<br/>';
                  for(var i=0; i<obj.data.other.length; i++) {
                    labelShow += obj.data.other[i].name + obj.data.other[i].value +'<br/>';
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
                    textStyle:{
                      color:'#333'
                    }
                  }
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                itemStyle:{
                  normal:{
                    color:'#FFF'
                  }
                },
                data: opt.series[0].data
              }, {
                name: opt.series[1].name,
                type: 'pie',
                label: {
                  normal: {
                    formatter: function(obj) {
                      var labelShow = obj.data.name + '\n';
                      for(var i=0; i<obj.data.other.length; i++) {
                        labelShow += obj.data.other[i].name + obj.data.other[i].value +'\n';
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
              if(chartInstance1) {
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
        scope:{
          icontent:'='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          console.log(scope);
          var chartInstance2 = null;
          previewService.getDetail(scope.icontent.url,{
            queryTime: previewService.getDateFormat(scope.icontent.model, scope.icontent.format),
            picCode: scope.icontent.picCode
          }).then(function(result) {
            var opt = result.data;
            if(!opt || !opt.series) {
              return;
            }
            var colors = ['rgb(0,204,200)', 'rgb(232,175,64)', 'rgb(0,168,228)'];
            var option = {
              color:colors,
              tooltip: {
                trigger: 'item',
                formatter: function(obj) {
                  var labelShow = obj.data.name + '<br/>';
                  for(var i=0; i<obj.data.other.length; i++) {
                    labelShow += obj.data.other[i].name + obj.data.other[i].value +'<br/>';
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
                    formatter: '{b}\n {c}%',
                    textStyle:{
                      color:'#333'
                    }
                  }
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                itemStyle:{
                  normal:{
                    color:'#FFF'
                  }
                },
                data: opt.series[0].data
              }, {
                name: opt.series[1].name,
                type: 'pie',
                label: {
                  normal: {
                    formatter: function(obj) {
                      var labelShow = obj.data.name + '\n';
                      for(var i=0; i<obj.data.other.length; i++) {
                        labelShow += obj.data.other[i].name + obj.data.other[i].value + obj.data.other[i].unit +'\n';
                      }
                      return labelShow;
                    }
                  }
                },
                radius: ['30%', '55%'],
                data:opt.series[1].data
              }]
            };

            chartInstance2 = echarts.init((element.find('div'))[0]);
            chartInstance2.setOption(option);

            scope.onResize2 = function() {
              if(chartInstance2){
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
        scope:{
          vcontent:'='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          console.log(scope);
          var chartInstance3 = null;
          previewService.getDetail(scope.vcontent.url,{
            queryTime: previewService.getDateFormat(scope.vcontent.model, scope.vcontent.format),
            picCode: scope.vcontent.picCode
          }).then(function(result) {
            var opt = result.data;
            if(!opt || !opt.series) {
              return;
            }
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

            var colors = ['rgb(232, 215, 64)','rgb(154, 253, 138)','rgb(14, 83, 108)'];
            var areaColors = ['rgba(232, 215, 64, 0.5)','rgba(154, 253, 138, 0.5)','rgba(14, 83, 108, 0.5)'];
            _.forEach(opt.series[0].data, function(item, index) {
              item.itemStyle = {normal: {
                color: colors[index],
                borderType: 'dashed'
              }};
              item.areaStyle = {normal: {
                opacity: 0.9,
                color: areaColors[index]
              }}
            });
            console.log(opt.series[0].data);
            var option = {
              tooltip: {},
              title:{
                text:"总投资：" + "608.31" + "亿元" ,
                subtext: "增速：" + "17.5" +"%",
                textStyle:{
                  fontSize:12
                },
                subtextStyle:{
                  fontSize:12,
                  color:'#333',
                  fontWeight:'border'
                },
                itemGap:10,
                padding:6,
                borderColor:'#DDD',
                borderWidth:1
              },
              legend: {
                orient: 'vertical',
                left: 'right',
                data: opt.legend,
              },
              radar: {
                // shape: 'circle',
                indicator: indicators
              },
              series: [{
                name: ' 全社会固定资产投资情况',
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
              if(chartInstance3){
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
        scope:{
          ccontent:'='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          console.log(scope);
          var chartInstance4 = null;
          previewService.getDetail(scope.ccontent.url,{
            queryTime: previewService.getDateFormat(scope.ccontent.model, scope.ccontent.format),
            picCode: scope.ccontent.picCode
          }).then(function(result) {
            var opt = result.data;
            if(!opt || !opt.series) {
              return;
            }
            var colors = ['rgb(255,169,34)', 'rgb(0,152,72)', 'rgb(0,168,228)'];
            var option = {
              color:colors,
              tooltip: {
                trigger: 'axis'
              },
              legend:{
                top:'bottom',
                data:opt.legend
              },
              xAxis: {
                type: 'category',
                boundaryGap: false,
                data: opt.x_data
              },
              yAxis: {
                type: 'value',
                axisLabel: {
                  formatter: '{value}'
                }
              },
              series: opt.series
            };

            chartInstance4 = echarts.init((element.find('div'))[0]);
            chartInstance4.setOption(option);

            scope.onResize4 = function() {
              if(chartInstance4){
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
        scope:{
          scontent:'='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          console.log(scope);
          var chartInstance5 = null;
          previewService.getDetail(scope.scontent.url,{
            queryTime: previewService.getDateFormat(scope.scontent.model, scope.scontent.format),
            picCode: scope.scontent.picCode
          }).then(function(result) {
            var opt = result.data;
            if(!opt || !opt.series) {
              return;
            }
            var colors = ['rgb(107,217,95)', 'rgb(0,168,228)'];
            var option = {
              color:colors,
              tooltip: {
                trigger: 'item',
                formatter: function(obj) {
                  var labelShow = obj.data.name + '<br/>';
                  for(var i=0; i<obj.data.other.length; i++) {
                    labelShow += obj.data.other[i].name + obj.data.other[i].value +'<br/>';
                  }
                  return labelShow;
                }
              },
              title:{
                text:"社消零售总额：" + "136.2" + "亿元" ,
                subtext: "同比增速：" + "12.9" +"%",
                textStyle:{
                  fontSize:12
                },
                subtextStyle:{
                  fontSize:12,
                  color:'#333',
                  fontWeight:'border'
                },
                itemGap:10,
                padding:6,
                borderColor:'#DDD',
                borderWidth:1
              },
              series: [{
                name: opt.series[0].name,
                type: 'pie',
                radius: '55%',
                center: ['50%', '50%'],
                startAngle:-230,
                data:opt.series[0].data,
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
                      formatter: '{b} : {c}亿 \n占比 :{d}%'
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
              if(chartInstance5) {
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