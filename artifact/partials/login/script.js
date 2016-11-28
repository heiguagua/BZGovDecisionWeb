(function() {
  /** Module */
  var login = angular.module('app.login', ['ngCookies']);
  //login.$inject = ['$cookies'];
  /** Controller */
  login.controller('loginController', [
    '$rootScope', '$cookies', '$scope', '$state', 'loginService',
    function($rootScope, $cookies, $scope, $state, loginService) {
      // Decide login or session delay
      if(sessionStorage.token){
        sessionStorage.removeItem('token');
      }
      if(sessionStorage.message){
        $scope.alerts = [
          {type: 'danger', msg: sessionStorage.message}
        ];
        $scope.closeAlert = function(index) {
          $scope.alerts.splice(index, 1);
        };
        sessionStorage.removeItem('message');
      }
      // Login validation
      $scope.Login = {};
      $scope.Login.submit = function(valid) {
        console.log(valid);
        $scope.loginSubmitted = false;
        if (valid) {
          var username = $scope.Login.username;
          var password = hex_md5($scope.Login.password);
          loginService.login({
            username: username,
            password: password
          }).then(function(result) {
            var loginUser = result.data.body[0];
            $rootScope.User = loginUser;
            $cookies.put('User', JSON.stringify(loginUser));
            console.log(JSON.stringify(loginUser));
            var sessionToken = result.data.head.token;
            if(sessionToken){
              sessionStorage.token = sessionToken;
            }
            if (200 == result.data.head.status) {
              $state.go("main.preview");
            } else {
              $scope.loginError = true;
            }
          });
        } else {
          $scope.loginSubmitted = true;
        }
      }

    }
  ]);

  /** Service */
  login.factory('loginService', ['$http', 'URL',
    function($http, URL) {
      return {
        login: login
      }

      function login(data) {
        return $http.post(
          URL + '/login', {
            data: data
          }
        )
      }
    }
  ]);

})();
