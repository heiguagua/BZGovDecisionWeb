(function () {
  /** Module */
  var ecocounty = angular.module('app.main.module.content.ecocounty', ['ui.bootstrap', 'cgBusy']);
  /** Controller */
  ecocounty.controller('ecocountyController', [
    '$scope', 'ecocountyService', '$stateParams',
    function ($scope, ecocountyService, $stateParams) {
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
      $scope.format = "yyyy/MM/dd";
      $scope.altInputFormats = ['yyyy/M!/d!'];

      $scope.popup1 = {
        opened: false
      };
      $scope.open1 = function () {
        $scope.popup1.opened = true;
      };
    }
  ]);


  /** Service */
  ecocounty.factory('ecocountyService', ['$http', 'URL',
    function ($http, URL) {
      return {
        "": ""
      }
    }
  ]);

})();
