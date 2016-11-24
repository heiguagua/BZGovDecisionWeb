(function() {
  /** Module */
  var login = angular.module('app.login', []);
  /** Controller */
  login.controller('loginController', [
    '$scope', 'loginService','$state','$stateParams',
    function($scope, loginService,$state,$stateParams) {
      var vm = this;
    }
  ]);

  /** Service */
  login.factory('loginService', ['$http', 'URL',
    function($http, URL) {
      return {
        getMenus: getMenus
      }

      function getMenus(params) {
        return $http.get(
          URL + '/login/menu',{
            params: params
          }
        )
      }
    }
  ]);

})();
