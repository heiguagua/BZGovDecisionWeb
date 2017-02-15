(function() {
  /** Module */
  var spot = angular.module('app.profile.spot', ['angular-bootstrap-select',
  'angular-bootstrap-select.extra']);
  spot.$inject = ['$location'];
  /** Controller */
  spot.controller('spotController', [
    '$scope', 'spotService', '$state', '$stateParams', '$window','$rootScope',
    function($scope, spotService, $state, $stateParams, $window,$rootScope) {
      var vm = this;
      $rootScope.showMenu = true;
      $('.profile').css({
        'background': 'url(assets/images/bg.png)'
      });

      $scope.quarterOptions = [{
        'id': 3,
        "name": "第1季度"
      }, {
        'id': 6,
        "name": "1-2季度"
      }, {
        'id': 9,
        "name": "1-3季度"
      }, {
        'id': 12,
        "name": "1-4季度"
      }];

      $scope.quarter = 3;

      $scope.spotlist = [];
      var menuId = $stateParams.proid;
      $rootScope.currentMenu = menuId;
      // spotService.getContent({
      //   menuId: menuId
      // }).then(function(result) {
      //   vm.spotcontent = _.sortBy(result.data, ['picCode']);
      //   _.forEach(vm.spotcontent, function(item) {
      //     var chart = {};
      //     chart.opened = false;
      //     chart.url = item.url;
      //     chart.picCode = item.picCode;
      //     $scope.spotlist.push(chart);
      //   });
      //
      // });

      // 主要经济指标
      // spotService.getspotData({
      //   picCode: 5003
      // }).then(function(result) {
      //   vm.spotData = result.data;
      //   $('.datalist').mCustomScrollbar();
      // })

      // spotService.getspotData({
      //   picCode: 5007
      // }).then(function(result) {
      //   vm.spotDataDown = result.data;
      //   $('.datalist').mCustomScrollbar();
      // })

    }
  ]);

  /** spot */
  spot.factory('spotService', ['$http', 'URL',
    function($http, URL) {
      return {
        getMenus: getMenus,
        getDetail: getDetail,
        getContent: getContent,
        getDateFormat: getDateFormat
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
    }
  ]);





})();
