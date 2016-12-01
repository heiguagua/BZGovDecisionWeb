'use strict';

(function() {

  angular.module('app', [
      'ngAnimate',
      'ui.router',
      'common.http',
      'app.dashboard',
      'app.login',
      'app.main',
      'app.file',
      'app.main.preview',
      'app.main.module',
      'app.main.module.content',
      'app.main.module.content.detail'
    ])
    .config(config);

  config.$inject = ['$stateProvider', '$urlRouterProvider', '$httpProvider'];

  function config($stateProvider, $urlRouterProvider, $httpProvider) {
    /** UI-Router Config */
    $urlRouterProvider.otherwise('/dashboard');
    $stateProvider
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'partials/dashboard/view.html',
        controller: 'dashboardController',
        controllerAs: 'dashboard',
      })
      .state('main', {
        url: '/main/:mid/:typeid/:murl',
        templateUrl: 'partials/main/view.html',
        controller: 'mainController',
        controllerAs: 'main',
      })
      .state('login', {
        url: '/login',
        templateUrl: 'partials/login/view.html',
        controller: 'loginController',
        controllerAs: 'login',
      })
      .state('main.preview', {
        url: '/preview/:preid',
        templateUrl: 'partials/preview/view.html',
        controller: 'previewController',
        controllerAs: 'preview',
      })
      .state('main.module', {
        url: '/module/:id/:url',
        templateUrl: 'partials/module/view.html',
        controller: 'moduleController',
        controllerAs: 'module',
      })
      .state('main.file', {
        url: '/file/:furl',
        templateUrl: 'partials/file/view.html',
        controller: 'fileController',
        controllerAs: 'file',
      })
      .state('main.module.content', {
        url: '/content/:tid',
        templateUrl: 'partials/module/content/view.html',
        controller: 'contentController',
        controllerAs: 'content',
      })
      .state('main.module.content.detail', {
        url: '/detail/:pid',
        templateUrl: 'partials/module/content/detail/view.html',
        controller: 'detailController',
        controllerAs: 'detail',
      })

    /** HTTP Interceptor */
    $httpProvider.interceptors.push(interceptor);
    interceptor.$inject = ['$q', '$location'];

    function interceptor($q, $location) {
      return {
        'request': function(config) {
          config.withCredentials = true;
          var screen_width = screen.width;
          var screen_height = screen.height;
          var box_height = $('.content-box').height() * 0.7 + 'px';
          // $('.content-box .chart').css({
          //   'height': box_height
          // });
          // $('.content-box .table-data').css({
          //   'height': $('.content-box').height() * 0.3 + 'px'
          // });
          return config;

        },
        'requestError': function(rejection) {
          return rejection;
        },
        'response': function(response) {
          $q.when(response, function(result) {

          });
          return response;
        },
        'responseError': function(rejection) {
          return rejection;
        }
      };
    };
  };

//  runState.$inject = ['$rootScope'];

  //function runState($rootScope) {
    // $rootScope.$on('$stateChangeStart',
    //   function(event, toState, toParams, fromState, fromParams) {
    //     console.log(toState.name);
    //
    //     if (toState.name !== 'dashboard') {
    //       if (toState.name !== 'login') {
    //         if (!sessionStorage.token) {
    //           event.preventDefault();
    //           window.location.href = './#/login';
    //         }
    //       };
    //     }
    //   });
  //}

})();
