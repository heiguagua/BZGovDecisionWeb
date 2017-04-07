(function() {
  /** Module */
  var dashboard = angular.module('app.dashboard', []);
  dashboard.$inject = ['$location'];
  /** Controller */
  dashboard.controller('dashboardController', [
    '$scope', 'dashboardService','$state',
    function($scope, dashboardService,$state) {
      var vm = this;
      $scope.chartlist = [];

      dashboardService.getMenus({
        parentId: "0"
      }).then(function(result) {
        vm.menus = result.data;
        if (vm.menus && vm.menus[0] && vm.menus[0].id) {
          $state.go('profile',{location: 'replace'});

          // dashboardService.getContent({
          //   menuId: vm.menus[0].id
          // }).then(function(result) {
          //   vm.dashcontent = _.sortBy(result.data, ['picCode']);
          //   _.forEach(vm.dashcontent, function(item) {
          //     var chart = {};
          //     chart.opened = false;
          //     chart.url = item.url;
          //     chart.picCode = item.picCode;
          //     $scope.chartlist.push(chart);
          //   });
          // });
        }
      });

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


})();
