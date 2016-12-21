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
            $scope.mInfo = res.data;
            if (!$scope.mInfo.model && $scope.mInfo.init_query_time != '') {
              $scope.mInfo.model = new Date($scope.mInfo.init_query_time);
            }
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
      // $scope.allDatas = [{
      //   qxname: '通江县',
      //   data: [{
      //     title: '地区生产总值GDP',
      //     item: [{
      //       total: '77.37',
      //       unit: '亿元'
      //     }, {
      //       rate: '6.1',
      //       unit: '%'
      //     }]
      //   }, {
      //     title: '社会消费品零售总额',
      //     item: [{
      //       total: '41.02',
      //       unit: '亿元'
      //     }, {
      //       rate: '12.9',
      //       unit: '%'
      //     }]
      //   }, {
      //     title: '固定资产投资',
      //     item: [{
      //       total: '136.95',
      //       unit: '亿元'
      //     }, {
      //       rate: '14.0',
      //       unit: '%'
      //     }]
      //   }, {
      //     title: '财政八项支出',
      //     item: [{
      //       total: '18.93',
      //       unit: '亿元'
      //     }, {
      //       rate: '0.16',
      //       unit: '%'
      //     }]
      //   }, {
      //     title: '规上工业',
      //     item: [{
      //       total: '',
      //       unit: '亿元'
      //     }, {
      //       rate: '10.5',
      //       unit: '%'
      //     }]
      //   }]
      // }, {
      //   qxname: '南江县',
      //   data: [{
      //     title: '地区生产总值GDP',
      //     item: [{
      //       total: '80.70',
      //       unit: '亿元'
      //     }, {
      //       rate: '6.4',
      //       unit: '%'
      //     }]
      //   }, {
      //     title: '社会消费品零售总额',
      //     item: [{
      //       total: '38.79',
      //       unit: '亿元'
      //     }, {
      //       rate: '13.0',
      //       unit: '%'
      //     }]
      //   }, {
      //     title: '固定资产投资',
      //     item: [{
      //       total: '178.99',
      //       unit: '亿元'
      //     }, {
      //       rate: '14.0',
      //       unit: '%'
      //     }]
      //   }, {
      //     title: '财政八项支出',
      //     item: [{
      //       total: '24.07',
      //       unit: '亿元'
      //     }, {
      //       rate: '25.00',
      //       unit: '%'
      //     }]
      //   }, {
      //     title: '规上工业',
      //     item: [{
      //       total: '',
      //       unit: '亿元'
      //     }, {
      //       rate: '10.7',
      //       unit: '%'
      //     }]
      //   }]
      // }, {
      //   qxname: '巴州区',
      //   data: [{
      //     title: '地区生产总值GDP',
      //     item: [{
      //       total: '92.11',
      //       unit: '亿元'
      //     }, {
      //       rate: '8',
      //       unit: '%'
      //     }]
      //   }, {
      //     title: '社会消费品零售总额',
      //     item: [{
      //       total: '61.47',
      //       unit: '亿元'
      //     }, {
      //       rate: '12.9',
      //       unit: '%'
      //     }]
      //   }, {
      //     title: '固定资产投资',
      //     item: [{
      //       total: '164.65',
      //       unit: '亿元'
      //     }, {
      //       rate: '17.7',
      //       unit: '%'
      //     }]
      //   }, {
      //     title: '财政八项支出',
      //     item: [{
      //       total: '18.7',
      //       unit: '亿元'
      //     }, {
      //       rate: '28.00',
      //       unit: '%'
      //     }]
      //   }, {
      //     title: '规上工业',
      //     item: [{
      //       total: '',
      //       unit: '亿元'
      //     }, {
      //       rate: '10.4',
      //       unit: '%'
      //     }]
      //   }]
      // }, {
      //   qxname: '平昌县',
      //   data: [{
      //     title: '地区生产总值GDP',
      //     item: [{
      //       total: '93.63',
      //       unit: '亿元'
      //     }, {
      //       rate: '7.5',
      //       unit: '%'
      //     }]
      //   }, {
      //     title: '社会消费品零售总额',
      //     item: [{
      //       total: '49.17',
      //       unit: '亿元'
      //     }, {
      //       rate: '13.1',
      //       unit: '%'
      //     }]
      //   }, {
      //     title: '固定资产投资',
      //     item: [{
      //       total: '183.82',
      //       unit: '亿元'
      //     }, {
      //       rate: '17.8',
      //       unit: '%'
      //     }]
      //   }, {
      //     title: '财政八项支出',
      //     item: [{
      //       total: '24.19',
      //       unit: '亿元'
      //     }, {
      //       rate: '25.01',
      //       unit: '%'
      //     }]
      //   }, {
      //     title: '规上工业',
      //     item: [{
      //       total: '',
      //       unit: '亿元'
      //     }, {
      //       rate: '10.6',
      //       unit: '%'
      //     }]
      //   }]
      // }, {
      //   qxname: '恩阳区',
      //   data: [{
      //     title: '地区生产总值GDP',
      //     item: [{
      //       total: '40.07',
      //       unit: '亿元'
      //     }, {
      //       rate: '10.1',
      //       unit: '%'
      //     }]
      //   }, {
      //     title: '社会消费品零售总额',
      //     item: [{
      //       total: '12.89',
      //       unit: '亿元'
      //     }, {
      //       rate: '13.6',
      //       unit: '%'
      //     }]
      //   }, {
      //     title: '固定资产投资',
      //     item: [{
      //       total: '74.56',
      //       unit: '亿元'
      //     }, {
      //       rate: '27.8',
      //       unit: '%'
      //     }]
      //   }, {
      //     title: '财政八项支出',
      //     item: [{
      //       total: '13.58',
      //       unit: '亿元'
      //     }, {
      //       rate: '30.16',
      //       unit: '%'
      //     }]
      //   }, {
      //     title: '规上工业',
      //     item: [{
      //       total: '',
      //       unit: '亿元'
      //     }, {
      //       rate: '10.7',
      //       unit: '%'
      //     }]
      //   }]
      // }];
      //$scope.qxdata = $scope.allDatas[0];
    }
  ]);

  /** Service */
  menu.factory('menuService', ['$http', 'URL',
    function($http, URL) {
      return {
        getContent: getContent,
        getDetail: getDetail
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
