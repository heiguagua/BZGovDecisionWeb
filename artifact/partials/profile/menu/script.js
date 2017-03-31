(function() {
  /** Module */
  var menu = angular.module('app.profile.menu', []);
  menu.$inject = ['$location'];
  /** Controller */
  menu.controller('menuController', [
    '$scope', 'menuService','$stateParams','$rootScope',
    function($scope, menuService,$stateParams,$rootScope) {
      var vm = this;
      $rootScope.showMenu = true;
      $('.profile').css({'background':'url(assets/images/bg_profile.png)'});
      var menuId = $stateParams.proid;
      $rootScope.currentMenu = '';
      menuService.getContent({
        menuId: menuId
      }).then(function(result) {
        var data = result.data;
        if(data && data[0]) {
          menuService.getDetail(data[0].url, {
            picCode: data[0].picCode
          }).then(function(res) {
            var datas = res.data.series;
            $scope.allDatas = [];
            _.forEach(datas,function(item) {
              var indicator = {};
              indicator.qxname = item.name;
              indicator.data = [];
              var itemData = item.data;
              var data = [];
              _.forEach(itemData,function(cell) {
                var cellData = {};
                cellData.item = [];

                if(_.map(indicator.data,'title').indexOf(cell.name) > -1) {
                  _.forEach(indicator.data,function(cdata,index) {
                    if(cdata.title == cell.name) {
                      indicator.data[index].item.push(cell);
                    }
                  })
                }
                else{
                  cellData.title = cell.name;
                  cellData.dep_name = cell.dep_name;
                  if (cell.init_query_time && cell.init_query_time != '') {
                    var date = new Date(cell.init_query_time.replace(' ', 'T'));
                    cellData.model = menuService.getDateFormat(date,'M月');
                  }
                  else{
                    cellData.model = '';
                  }
                  cellData.item.push(cell);
                  indicator.data.push(cellData);
                }
              });
              $scope.allDatas.push(indicator);
            });
            $scope.qxdata = $scope.allDatas[0];
            console.log($scope.allDatas);
          })
        }

      });

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
  menu.factory('menuService', ['$http', 'URL',
    function($http, URL) {
      return {
        getContent: getContent,
        getDetail: getDetail,
        getDateFormat: getDateFormat
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

  menu.directive('wiservChartMap', ['menuService', '$window',
    function(menuService, $window) {
      return {
        restrict: 'ACE',
        scope: {
          content: '=',
          all: '='
        },
        template: "<div id='bzmap' style='width:100%;height:100%'></div>",
        link: function(scope, element, attrs) {
          var chart = {};
          scope.$applyAsync(function() {
            chart = echarts.init(document.getElementById('bzmap'));

            setTimeout(function() {
              chart.clear();
              chart.resize();

              chart.setOption({
                // color:['rgb(195,211,234)','rgb(2,230,239)'],
                legend: {
                  orient: 'vertical',
                  left: 'left'
                },
                series: [{
                  name:'巴中市经济概况',
                  type: 'map',
                  map: 'bz',
                  left: 10,
                  top: 20,
                  right: 10,
                  bottom: 10,
                  selectedMode: 'single',
                  label: {
                    normal: {
                      show: true,
                      textStyle: {
                        color: '#FFF',
                        fontSize: 16
                      }
                    },
                    emphasis: {
                      show: true
                    }
                  },
                  itemStyle: {
                    normal: {
                      areaColor: '#FFF',
                      // color: 'rgb(195,211,234)',
                      color:new echarts.graphic.RadialGradient(0, 0, 8, [
                        {  offset: 0,
                          color: 'rgb(195,211,234)' // 0% 处的颜色
                        },
                        {
                          offset: 1,
                          color: 'rgb(195,211,234)' // 0% 处的颜色
                        }
                      ], false),
                      borderColor: 'rgba(42,180,238,1)',
                      borderType: 'solid',
                    }
                  },
                  markPoint: {
                    symbol: 'pin',
                    symbolSize: 50
                  },
                  data: [{
                    name: '通江县',
                    value:123,
                    itemStyle: {
                      normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                          offset: 0,
                          color: 'rgb(18,126,215)' // 0% 处的颜色
                        }, {
                          offset: 1,
                          color: 'rgb(17,80,201)' // 100% 处的颜色
                        }], false),
                        borderColor: 'rgba(42,180,238,1)',
                        borderWidth: 3,
                        borderType: 'solid',
                      }
                    }
                  }, {
                    name: '南江县',
                    value:223,
                    itemStyle: {
                      normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                          offset: 0,
                          color: 'rgb(18,126,215)' // 0% 处的颜色
                        }, {
                          offset: 1,
                          color: 'rgb(17,80,201)' // 100% 处的颜色
                        }], false),
                        borderColor: 'rgba(42,180,238,1)',
                        borderWidth: 3,
                        borderType: 'solid',
                      }
                    }
                  }, {
                    name: '巴州区',
                    value:123,
                    itemStyle: {
                      normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                          offset: 0,
                          color: 'rgb(19,162,226)' // 0% 处的颜色
                        }, {
                          offset: 1,
                          color: 'rgb(18,132,217)' // 100% 处的颜色
                        }], false),
                        borderColor: 'rgba(42,180,238,1)',
                        borderWidth: 3,
                        borderType: 'solid',
                      }
                    }
                  }, {
                    name: '平昌县',
                    value:123,
                    itemStyle: {
                      normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                          offset: 0,
                          color: 'rgb(19,164,227)' // 0% 处的颜色
                        }, {
                          offset: 1,
                          color: 'rgb(18,112,210)' // 100% 处的颜色
                        }], false),
                        borderColor: 'rgba(42,180,238,1)',
                        borderWidth: 3,
                        borderType: 'solid',
                      }
                    }
                  }, {
                    name: '恩阳区',
                    value:123,
                    itemStyle: {
                      normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                          offset: 0,
                          color: 'rgb(19,175,230)' // 0% 处的颜色
                        }, {
                          offset: 1,
                          color: 'rgb(19,164,227)' // 100% 处的颜色
                        }], false),
                        borderColor: 'rgba(42,180,238,1)',
                        borderWidth: 3,
                        borderType: 'solid',
                      }
                    }
                  }]

                }]
              });
              $('#bzmap').css({'background-image':'url(assets/images/map_bg.png)'});
            }, 500);
          //  scope.content = scope.all[0];

            chart.on('mapselectchanged', function(params) {
              var selectedName = params.name;
              _.forEach(scope.all, function(item) {
                if (selectedName && selectedName == item.qxname) {
                  scope.content = item;
                  scope.$apply(function() {
                    scope.content = item;
                  });
                }
              })
            })
          })

          scope.onResize = function() {
            if (chart) {
              chart.resize();
            }
          }

          angular.element($window).bind('resize', function() {
            scope.onResize();
          });


          angular.element($window).bind('resize', function() {
            scope.onResize();
          })
        }
      }
    }
  ]);




})();
