(function() {
  /** Module */
  var detail = angular.module('app.main.module.content.detail', ['ui.bootstrap']);
  /** Controller */
  detail.controller('detailController', [
    '$scope', 'detailService', '$stateParams',
    function($scope, detailService, $stateParams) {
      var vm = this;
      $scope.popups = [];
      detailService.getContent({
        menuId: $stateParams.pid
      }).then(function(result) {
        vm.content = (result && result.data) ? result.data.body : "";
        _.forEach(vm.content, function(item) {
          var popup = {};
          popup.opened = false;
          popup.model = new Date();

          var dateOptions = {};
          dateOptions.formatYear = 'yyyy';
          if(item.queryTime == 'year') {
            popup.format = 'yyyy';
            dateOptions.minMode = 'year';
            dateOptions.datepickerMode = 'year';
          }
          if(item.queryTime == 'month') {
            popup.format = 'yyyy-MM';
            dateOptions.minMode = 'month';
            dateOptions.datepickerMode = 'month';
            popup.model.setMonth(popup.model.getMonth()-1);
          }
          popup.dateOptions = dateOptions;
          $scope.popups.push(popup);
        });
      })
      //
      // $scope.dateOptions = {
      //   minMode: 'month',
      //   datepickerMode: 'month',
      //   formatYear: 'yyyy',
      //   startingDay: 1
      // };

      $scope.open = function(index) {
        $scope.popups[index].opened = true;
      };
      // $scope.altInputFormats = ['M!/d!/yyyy'];

    }
  ]);

  /** Service */
  detail.factory('detailService', ['$http', 'URL',
    function($http, URL) {
      return {
        getContent: getContent
      }

      function getContent(params) {
        return $http.get(
          URL + '/main/showPics', {
            params: params
          }
        )
      }
    }
  ]);

})();
