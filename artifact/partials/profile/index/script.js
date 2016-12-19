(function() {
  /** Module */
  var index = angular.module('app.profile.index', []);
  index.$inject = ['$location'];
  /** Controller */
  index.controller('indexController', [
    '$scope', 'indexService','$stateParams','$rootScope',
    function($scope, indexService,$stateParams,$rootScope) {
      var vm = this;
      $('.profile').css({'background':'url(assets/images/bg_profile.png)'});
      var menuId = $stateParams.proid;
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
    }
  ]);

  /** Service */
  index.factory('indexService', ['$http', 'URL',
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


})();
