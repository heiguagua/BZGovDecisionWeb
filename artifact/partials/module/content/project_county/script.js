(function() {
  /** Module */
  var projectcounty = angular.module('app.main.module.content.projectcounty', ['ui.bootstrap','cgBusy']);
  /** Controller */
  projectcounty.controller('projectcountyController', [
    '$scope', 'projectcountyService', '$stateParams',
    function($scope, projectcountyService, $stateParams) {
      var vm = this;
     $scope.popups = [];
      $scope.quarterOptions = [{
        'id': 3,
        "name": "第一季度"
      }, {
        'id': 6,
        "name": "第二季度"
      }, {
        'id': 9,
        "name": "第三季度"
      }];
//  时间插件
      $scope.dat = new Date();
      $scope.format = "yyyy";
      $scope.altInputFormats = ['yyyy/M!/d!'];
      $scope.dateOptions = {};
      $scope.dateOptions.minMode = 'year';
      $scope.dateOptions.datepickerMode = 'year';
      $scope.popup1 = {
        opened: false
      };
      $scope.open1 = function () {
        $scope.popup1.opened = true;
      };
    }
  ]);

  /** Service */
  projectcounty.factory('projectcountyService', ['$http', 'URL',
    function($http, URL) {
      return {
        "": ""
      }
    }
  ]);

})();
