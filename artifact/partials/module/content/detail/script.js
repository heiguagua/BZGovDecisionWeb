(function() {
  /** Module */
  var detail = angular.module('app.main.module.content.detail', ['ui.bootstrap']);
  /** Controller */
  detail.controller('detailController', [
    '$scope', 'detailService', '$stateParams',
    function($scope, detailService, $stateParams) {
      var vm = this;
      getContent($stateParams.pid);

      $scope.dateOptions = {
        minMode:'month',
        datepickerMode:'month',
        formatYear: 'yyyy',
        startingDay: 1
      };

      $scope.open1 = function() {
        $scope.popup1.opened = true;
      };
      $scope.popup1 = {
        opened: false
      };
      $scope.formats = ['yyyy-MM', 'yyyy'];
      $scope.format = $scope.formats[0];
      $scope.altInputFormats = ['M!/d!/yyyy'];

      function getContent(id) {
        detailService.getContent({
          menuId: id
        }).then(function(result) {
          vm.content = (result && result.data) ? result.data.body : "";
        })
      }
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
