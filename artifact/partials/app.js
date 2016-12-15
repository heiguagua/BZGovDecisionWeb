

(function() {

  angular.module('app', [
      'ui.router',
      'common.http',
      'app.dashboard',
      'app.login',
      'app.main',
      'app.profile',
      'app.profile.menu',
      'app.profile.eco',
      'app.profile.industry',
      'app.profile.agri',
      'app.profile.service',
      'app.profile.travel',
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
      .state('profile', {
        url: '/profile',
        templateUrl: 'partials/profile/view.html',
        controller: 'profileController',
        controllerAs: 'profile',
      })
      .state('profile.menu', {
        url: '/menu',
        templateUrl: 'partials/profile/menu/view.html',
        controller: 'menuController',
        controllerAs: 'menu',
      })
      .state('profile.eco', {
        url: '/eco/:proid',
        templateUrl: 'partials/profile/eco/view.html',
        controller: 'ecoController',
        controllerAs: 'eco',
      })
      .state('profile.industry', {
        url: '/industry/:proid',
        templateUrl: 'partials/profile/industry/view.html',
        controller: 'industryController',
        controllerAs: 'industry',
      })
      .state('profile.agri', {
        url: '/agri/:proid',
        templateUrl: 'partials/profile/agri/view.html',
        controller: 'agriController',
        controllerAs: 'agri',
      })
      .state('profile.service', {
        url: '/service/:proid',
        templateUrl: 'partials/profile/service/view.html',
        controller: 'serviceController',
        controllerAs: 'service',
      })
      .state('profile.travel', {
        url: '/travel/:proid',
        templateUrl: 'partials/profile/travel/view.html',
        controller: 'travelController',
        controllerAs: 'travel',
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
          //config.withCredentials = true;
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
