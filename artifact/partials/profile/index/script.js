(function() {
  /** Module */
  var index = angular.module('app.profile.index', []);
  index.$inject = ['$location'];
  /** Controller */
  index.controller('indexController', [
    '$scope', 'indexService','$stateParams','$rootScope','$window','$filter',
    function($scope, indexService,$stateParams,$rootScope,$window,$filter) {
      var vm = this;
      $('.profile').css({'background':'url(assets/images/bg_profile.png)'});
      var inner_line_height = $('.inner-line').height();
      var header_height = $('.header').outerHeight(true);
      var main_height = inner_line_height-header_height-20-15-2-15;
      $('.main').css({'max-height':(inner_line_height-header_height)+'px'});
      var menuId = $stateParams.proid;
      $rootScope.showMenu = false;
      $rootScope.currentMenu = '';
      indexService.getContent({
        menuId: menuId
      }).then(function(result) {
        var data = result.data;
        if(data && data[0]) {
          indexService.getDetail(data[0].url, {
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
                    cellData.model = indexService.getDateFormat(date,'M月');
                  }
                  else{
                    cellData.model = '';
                  }
                  console.log(cellData.model);
                  cellData.item.push(cell);
                  indicator.data.push(cellData);
                }
              });
              $scope.allDatas.push(indicator);
            });
            $scope.qxdata = $scope.allDatas[0];
          })
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

      });

      angular.element($window).bind('resize', function() {
        var inner_line_height = $('.inner-line').height();
        var header_height = $('.header').outerHeight(true);
        var main_height = inner_line_height-header_height-20-15-2-15;
        $('.main').css({'max-height':(inner_line_height-header_height)+'px'});
      })
    }
  ]);

  /** Service */
  index.factory('indexService', ['$http', 'URL',
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


})();
