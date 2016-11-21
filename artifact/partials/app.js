'use strict';

(function() {

  angular.module('app', [
    'ngAnimate',
    'ui.router',
    'common.http',
    'app.dashboard',
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
        url: '/main/:mid',
        templateUrl: 'partials/main/view.html',
        controller: 'mainController',
        controllerAs: 'main',
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
      .state('main.module.file', {
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
            return config;

          },
          'response': function(response) {
            $q.when(response, function(result){

            });
            return response;
          }
        };
      };
  };

})();
