(function() {
  /** Module */
  var goalquater = angular.module('app.main.module.content.goalquater', ['ui.bootstrap', 'cgBusy']);
  /** Controller */
  goalquater.controller('goalquaterController', [
    '$scope', 'goalquaterService', '$stateParams', '$rootScope',
    function($scope, goalquaterService, $stateParams, $rootScope) {
      var vm = this;
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
        _.forEach($scope.alldatas, function(item) {
          var url = item.url + '/' + item.picCode;

          goalquaterService.getContentDatas(url,params).then(function(res) {
            if (item.picCode == 'targetExamTotalRanks') {
              $scope.targetExamTotalRanks = res.data;
            }
            if (item.picCode == 'targetExamRanks') {
              $scope.targetExamRanks = res.data;
              $scope.targetExamRanks.url = url;
              $scope.datepick.model = new Date($scope.targetExamRanks.year);
              $scope.datepick.quarter = $scope.targetExamRanks.quarter?Number($scope.targetExamRanks.quarter):'';
            }
            if (item.picCode == 'penalUnits') {
              $scope.penalUnits = res.data;
              $scope.penlTotal = 0;

            }
            if (item.picCode == 'awardedUnits') {
              $scope.awardedUnits = res.data;
              $scope.awardedTotal = 0;
              setTimeout(function(){
                $('#awardedPlay').slick({
                  slidesToShow: 1,
                  slidesToScroll: 1,
                  autoplay: false,
                  autoplaySpeed: 3000,
                  prevArrow:'<div class="prev"><a class="btn btn-primary">上一条</a></div>',
                  nextArrow:'<div class="next"><a class="btn btn-primary">下一条</a></div>'
                },3000);
              })
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

    }
  ]);

  /** Service */
  goalquater.factory('goalquaterService', ['$http', 'URL',
    function($http, URL) {
      return {
        "getContent": getContent,
        "getContentDatas": getContentDatas,
        "getDateFormat":getDateFormat
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

          // scope.$watch('datemodel.model', function(newValue, oldValue) {
          //   if (newValue === oldValue || !newValue || !oldValue) {
          //     return;
          //   }
          //   getData();
          // });
          //
          // scope.$watch('datemodel.quarter', function(newValue, oldValue) {
          //   if (newValue === oldValue || !newValue || !oldValue) {
          //     return;
          //   }
          //   getData();
          // });
          //
          // function getData() {
          //   goalquaterService.getContentDatas(scope.quaterdata.url, {
          //     year: goalquaterService.getDateFormat(scope.datemodel.model, 'yyyy'),
          //     quarter: scope.datemodel.quarter
          //   }).then(function(res) {
          //     var url = scope.quaterdata.url;
          //     scope.quaterdata = res.data;
          //     scope.quaterdata.url = url;
          //     scope.datemodel.quarter = Number(scope.datemodel.quarter);
          //     redraw();
          //   })
          // }
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
              var chartData = scope.quaterdata.data;
              var legend = _.map(chartData, 'name');
              scope.datemodel.quarter = Number(scope.datemodel.quarter);
              var i = 0;
              var option = {
                title: {
                  left: 'center',
                  text: scope.quaterdata.year + '年第' + scope.datemodel.quarter + '季度 目标任务考核分项名次',
                  top: -2
                },
                tooltip: {},
                legend: {
                  left: 'left',
                  top: '10%',
                  orient: 'vertical',
                  data: legend,
                  itemGap: 4
                },

                radar: {
                  // shape: 'circle',
                  center: ['60%', '54%'],
                  name: {
                    textStyle: {
                      color: '#333'
                    }
                  },
                  radius: '65%',
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
                var chartInstance = echarts.init((element.find('div'))[0]);
                chartInstance.clear();
                chartInstance.resize();
                chartInstance.setOption(option);
              }, 300);
            }

          }


        }
      }
    }
  ]);

  goalquater.directive('wiservPenalPlay', ['goalquaterService', '$window',
    function(goalquaterService, $window) {
      return {
        restrict: 'ACE',
        scope: {
          penaldata: '=',
        },
        link: function(scope, element, attrs) {
          scope.$watch('penaldata', function(newValue, oldValue) {
            if (newValue === oldValue || !newValue || !oldValue) {
              return;
            }
            drawhtml();
          });
          drawhtml();
          function drawhtml() {
            if(scope.penaldata) {
              var htmlcontent = ''
              _.forEach(scope.penaldata,function(item){
                htmlcontent += "<div class='detail-item'>"+
                "<div class='cell'><h5>"+item.penal_unit+"</h5></div>"+
                "<div class='cell'><strong>-"+item.penal_points+"</strong></div>"+
                "<div class='cell'>计入"+item.penal_scope+"</div>"+
                "<div class='cell'>"+item.penal_target+"</div></div>";
              });
              element[0].innerHTML = htmlcontent;
              console.log($(element[0]));
              $(element[0]).slick({
                slidesToShow: 1,
                slidesToScroll: 1,
                autoplay: false,
                autoplaySpeed: 3000,
                prevArrow:'<div class="prev"><a class="btn btn-primary">上一条</a></div>',
                nextArrow:'<div class="next"><a class="btn btn-primary">下一条</a></div>'
              });
            }
          }

        }
      }
    }]);

    goalquater.directive('wiservAwardPlay', ['goalquaterService', '$window',
      function(goalquaterService, $window) {
        return {
          restrict: 'ACE',
          scope: {
            awarddata: '=',
          },
          link: function(scope, element, attrs) {
            scope.$watch('awarddata', function(newValue, oldValue) {
              if (newValue === oldValue || !newValue || !oldValue) {
                return;
              }
              drawhtml();
            });
            drawhtml();

            function drawhtml() {
              if(scope.awarddata) {
                var htmlcontent = ''
                _.forEach(scope.awarddata,function(item){
                  htmlcontent += "<div class='detail-item'>"+
                  "<div class='cell'><h4>"+item.awarded_unit+"</h4><h5>"+item.awarded_reason+"</h5></div>"+
                  "<div class='cell'><strong>+"+item.awarded_points+"</strong></div>"+
                  "<div class='cell'>计入"+item.awarded_scope+"</div></div>";
                });
                element[0].innerHTML = htmlcontent;
                $(element[0]).slick({
                  slidesToShow: 1,
                  slidesToScroll: 1,
                  autoplay: false,
                  autoplaySpeed: 3000,
                  prevArrow:'<div class="prev"><a class="btn btn-primary">上一条</a></div>',
                  nextArrow:'<div class="next"><a class="btn btn-primary">下一条</a></div>'
                });
              }
            }

          }
        }
      }])



})();
