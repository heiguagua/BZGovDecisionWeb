(function() {

  var module = angular.module('common.http', []);

  module.constant('URL',
  //  'http://localhost:5353'
  // 'http://172.16.7.52:8080'
  // 'http://192.168.9.103:8080'
  // 'http://localhost:8080/govDecision'
    location.protocol + '//' + location.host + "/govDecisionServer"
  );

  module.factory('validate', [
    function(){
      return function(data, status) {
        var resolve = function(code) {
          return data && data.head && data.head.status === code
        };
        switch(status) {
          case 200:
            return (resolve(status)); break;
          case 201:
            return (resolve(status)); break;
          case 202:
            return (resolve(status)); break;
          case 400:
            return (resolve(status)); break;
          case 404:
            return (resolve(status)); break;
          case 405:
            return (resolve(status)); break;
          case 415:
            return (resolve(status)); break;
          case 500:
            return (resolve(status)); break;
        }
      };
    }
  ]);

})();
