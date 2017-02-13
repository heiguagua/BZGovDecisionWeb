(function() {
  /** Module */
  var goalquater = angular.module('app.main.module.content.goalquater', ['ui.bootstrap', 'cgBusy', 'slick']);
  /** Controller */
  goalquater.controller('goalquaterController', [
    '$scope', 'goalquaterService', '$stateParams', '$rootScope', '$timeout',
    function($scope, goalquaterService, $stateParams, $rootScope, $timeout) {
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
          //alert('请输入正确的日期格式！');
          return;
        }
        if (!$scope.datepick.quarter) {
          alert('请选择季度！');
          return;
        }
        getAllDataDetails({
          year: goalquaterService.getDateFormat($scope.datepick.model, 'yyyy'),
          quarter: $scope.datepick.quarter
        });
      }

      $scope.altInputFormats = ['M!/d!/yyyy'];

      function getAllDataDetails(params) {
        $scope.awardedUnits = null;
        $scope.penalUnits = null;
        _.forEach($scope.alldatas, function(item) {
          var url = item.url + '/' + item.picCode;

          goalquaterService.getContentDatas(url, params).then(function(res) {
            if (item.picCode == 'targetExamTotalRanks') {
              $scope.targetExamTotalRanks = res.data;
            }
            if (item.picCode == 'targetExamRanks') {
              $scope.targetExamRanks = res.data;
              $scope.targetExamRanks.url = url;
              $scope.datepick.model = new Date($scope.targetExamRanks.year);
              $scope.datepick.quarter = $scope.targetExamRanks.quarter ? Number($scope.targetExamRanks.quarter) : '';
            }
            if (item.picCode == 'penalUnits') {
              $scope.penalUnits = res.data;
              $scope.penlTotal = 0;

            }
            if (item.picCode == 'awardedUnits') {
              $timeout(function() {
                $scope.awardedUnits = res.data;
                $scope.awardedTotal = 0;
              });
            }
          })
        })
      }

      goalquaterService.getContent({
        menuId: $stateParams.pid
      }).then(function(result) {
        $scope.alldatas = result.data;
        getAllDataDetails();
      })


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
  goalquater.factory('goalquaterService', ['$http', 'URL',
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

  goalquater.directive('wiservGoalQuater', ['goalquaterService', '$window',
    function(goalquaterService, $window) {
      return {
        restrict: 'ACE',
        scope: {
          quaterdata: '=',
          datemodel: '='
        },
        template: "<div style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          var chartInstance = null;
          scope.$watch('quaterdata', function(newValue, oldValue) {
            if (newValue === oldValue || !newValue || !oldValue) {
              return;
            }
            redraw();
          });

          redraw();

          function redraw() {
            if (scope.quaterdata && scope.quaterdata.area) {
              var areas = scope.quaterdata.area;
              var areaList = [];
              _.forEach(areas, function(item) {
                var obj = {};
                obj.name = item;
                obj.min = 1;
                obj.max = areas.length;
                areaList.push(obj);
              })
              var chartData = rankFormat(scope.quaterdata.data);
              var legend = _.map(chartData, 'name');
              scope.datemodel.quarter = Number(scope.datemodel.quarter);
              var i = 0;

              function rankFormat(chartdata) {
                var data = angular.copy(chartdata);
                _.forEach(data, function(item) {
                  var max = _.max(item.value);
                  var value = [];
                  var ranks = [];
                  _.forEach(item.value, function(rank) {
                    if (rank != '') {
                      value.push(1 + Number(max) - Number(rank));
                      ranks.push(rank);
                    } else {
                      value.push(rank);
                      ranks.push(rank);
                    }
                  });
                  item.value = value;
                  item.ranks = ranks;
                })
                return data;
              }

              var screen_width = screen.width;
              var radar_center = ['60%', '54%'];
              var radius = '65%';
              var legend_orient = 'vertical';
              var legend_top = '10%';
              var title_size = 18;
              var item_width = 25;
              var legend_padding = 5;
              if(screen_width< 1200) {
                radar_center = ['32%', '40%'];
                radius = '40%';
                legend_orient = 'horizontal';
                legend_top = 'bottom';
                title_size = 16;
                item_width = 35;
                legend_padding = [15,10,0,10];
              }
              var option = {
                title: {
                  left: 'center',
                  text: scope.quaterdata.year + '年第' + scope.datemodel.quarter + '季度 目标任务考核分项名次',
                  textStyle:{
                    fontSize: title_size
                  },
                  top: -2
                },
                tooltip: {
                  formatter: function(data) {
                    var text = data.name + "<br/>";
                    var datas = [];
                    _.forEach(areas, function(areaName, index) {
                      var item = {};
                      item.name = areaName;
                      item.rank = data.data.ranks[index];
                      datas.push(item);
                    });
                    datas = _.sortBy(datas,'rank');
                    _.forEach(datas, function(item) {
                      text += item.name + ":" + item.rank + "<br/>";
                    })
                    return text;
                  }
                },
                legend: {
                  left: 'left',
                  top: legend_top,
                  orient: legend_orient,
                  data: legend,
                  itemWidth: item_width,
                  padding: legend_padding
                },

                radar: {
                  // shape: 'circle',
                  center: radar_center,
                  name: {
                    textStyle: {
                      color: '#333'
                    }
                  },
                  radius: radius,
                  nameGap: 8,
                  indicator: areaList,
                  axisLabel: {
                    show: false,
                    formatter: function(data) {
                      i++;
                      if (i <= 6) {
                        return data;
                      }
                    }
                  }
                },
                series: [{
                  name: '目标任务考核',
                  type: 'radar',
                  symbol: 'line',
                  data: chartData
                }]
              };
              setTimeout(function() {
                chartInstance = echarts.init((element.find('div'))[0]);
                chartInstance.clear();
                chartInstance.resize();
                chartInstance.setOption(option);
              }, 300);
            }

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

  // goalquater.directive('wiservPenalPlay', ['goalquaterService', '$window',
  //   function(goalquaterService, $window) {
  //     return {
  //       restrict: 'ACE',
  //       scope: {
  //         penaldata: '=',
  //       },
  //       link: function(scope, element, attrs) {
  //         scope.$watch('penaldata', function(newValue, oldValue) {
  //           if (newValue === oldValue || !newValue || !oldValue) {
  //             return;
  //           }
  //           drawhtml();
  //         });
  //         drawhtml();
  //         function drawhtml() {
  //           if(scope.penaldata) {
  //             var htmlcontent = ''
  //             _.forEach(scope.penaldata,function(item){
  //               htmlcontent += "<div class='detail-item'>"+
  //               "<div class='cell'><h5>"+item.penal_unit+"</h5></div>"+
  //               "<div class='cell'><strong>-"+item.penal_points+"</strong></div>"+
  //               "<div class='cell'>计入"+item.penal_scope+"</div>"+
  //               "<div class='cell'>"+item.penal_target+"</div></div>";
  //             });
  //             element[0].innerHTML = htmlcontent;
  //             $(element[0]).slick({
  //               slidesToShow: 1,
  //               slidesToScroll: 1,
  //               autoplay: false,
  //               autoplaySpeed: 3000,
  //               prevArrow:'<div class="prev"><a class="btn btn-primary">上一条</a></div>',
  //               nextArrow:'<div class="next"><a class="btn btn-primary">下一条</a></div>'
  //             });
  //           }
  //         }
  //
  //       }
  //     }
  //   }]);
  //
  //   goalquater.directive('wiservAwardPlay', ['goalquaterService', '$window',
  //     function(goalquaterService, $window) {
  //       return {
  //         restrict: 'ACE',
  //         scope: {
  //           awarddata: '=',
  //         },
  //         link: function(scope, element, attrs) {
  //           scope.$watch('awarddata', function(newValue, oldValue) {
  //             if (newValue === oldValue || !newValue || !oldValue) {
  //               return;
  //             }
  //             drawhtml();
  //           });
  //           drawhtml();
  //
  //           function drawhtml() {
  //             if(scope.awarddata) {
  //               var htmlcontent = ''
  //               _.forEach(scope.awarddata,function(item){
  //                 htmlcontent += "<div class='detail-item'>"+
  //                 "<div class='cell'><h4>"+item.awarded_unit+"</h4><h5>"+item.awarded_reason+"</h5></div>"+
  //                 "<div class='cell'><strong>+"+item.awarded_points+"</strong></div>"+
  //                 "<div class='cell'>计入"+item.awarded_scope+"</div></div>";
  //               });
  //               scope.$applyAsync(function() {
  //                 element[0].innerHTML = htmlcontent;
  //                 $(element[0]).slick({
  //                   slidesToShow: 1,
  //                   slidesToScroll: 1,
  //                   autoplay: false,
  //                   autoplaySpeed: 3000,
  //                   prevArrow:'<div class="prev"><a class="btn btn-primary">上一条</a></div>',
  //                   nextArrow:'<div class="next"><a class="btn btn-primary">下一条</a></div>'
  //                 });
  //               })
  //
  //             }
  //           }
  //
  //         }
  //       }
  //     }])



})();
