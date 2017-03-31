(function() {

  var app = angular.module('app', [
      'ui.router',
      'ngCookies',
      'common.http',
      'app.dashboard',
      'app.login',
      'app.main',
      'app.home',
      'app.auth',
      'app.profile',
      'app.profile.index',
      'app.profile.menu',
      'app.profile.eco',
      'app.profile.industry',
      'app.profile.agri',
      'app.profile.service',
      'app.profile.travel',
      'app.profile.spot',
      'app.file',
      'app.main.preview',
      'app.main.module',
      'app.main.module.content',
      'app.main.module.content.detail',
      'app.main.module.content.goalprogress',
      'app.main.module.content.goalquater',
      'app.main.module.content.goalyear',
      'app.main.module.content.proceeding',
      'app.main.module.content.ecocity',
      'app.main.module.content.ecocounty',
      'app.main.module.content.ecogdp',
      'app.main.module.content.projectcity',
      'app.main.module.content.projectcounty'
    ]);

    app.config(config);
    app.run(runState);


app.factory('deviceService', [ function() {
  var ua = navigator.userAgent,
    isWindowsPhone = /(?:Windows Phone)/.test(ua),
    isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
    isAndroid = /(?:Android)/.test(ua),
    isFireFox = /(?:Firefox)/.test(ua),
    isChrome = /(?:Chrome|CriOS)/.test(ua),
    isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),
    isPhone = /(?:iPhone)/.test(ua) && !isTablet,
    isPc = !isPhone && !isAndroid && !isSymbian;
  return {
    isTablet: isTablet,
    isPhone: isPhone,
    isAndroid: isAndroid,
    isPc: isPc
  };
}]);

  config.$inject = ['$stateProvider', '$urlRouterProvider', '$httpProvider', '$locationProvider'];

  function config($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {
    /** UI-Router Config */
    // $locationProvider.html5Mode(true);
    var os = function() {
      var ua = navigator.userAgent,
        isWindowsPhone = /(?:Windows Phone)/.test(ua),
        isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
        isAndroid = /(?:Android)/.test(ua),
        isFireFox = /(?:Firefox)/.test(ua),
        isChrome = /(?:Chrome|CriOS)/.test(ua),
        isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),
        isPhone = /(?:iPhone)/.test(ua) && !isTablet,
        isPc = !isPhone && !isAndroid && !isSymbian;
      return {
        isTablet: isTablet,
        isPhone: isPhone,
        isAndroid: isAndroid,
        isPc: isPc
      };
    }();
    // $urlRouterProvider.otherwise('/profile');
    var screen_width = screen.width;
    var client_width = document.body.clientWidth;
    if (screen_width < 1024 || client_width < 1024 || os.isAndroid || os.isPhone) {
      $urlRouterProvider.otherwise('/home');
    } else {
      $urlRouterProvider.otherwise('/auth');
    }
    // $urlRouterProvider.when('/home', ['$match','$stateParams',function ($match, $stateParams) {
    //   var screen_width = screen.width;
    //   if(screen_width<1024){
    //     return '/home';
    //   }
    //   else{
    //     return '/home';
    //   }
    // }]);

    $stateProvider
    .state('auth', {
        url: '/auth',
        templateUrl: 'partials/auth/view.html',
        controller: 'authController',
        controllerAs: 'auth',
      })
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'partials/dashboard/view.html',
        controller: 'dashboardController',
        controllerAs: 'dashboard',
      })
      .state('home', {
        url: '/home',
        templateUrl: 'partials/home/view.html',
        controller: 'homeController',
        controllerAs: 'home',
      })
      .state('profile', {
        url: '/profile',
        templateUrl: 'partials/profile/view.html',
        controller: 'profileController',
        controllerAs: 'profile',
      })
      .state('profile.index', {
        url: '/index/:proid',
        templateUrl: 'partials/profile/index/view.html',
        controller: 'indexController',
        controllerAs: 'index',
      })
      .state('profile.menu', {
        url: '/menu/:proid',
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
      .state('profile.spot', {
        url: '/spot/:proid',
        templateUrl: 'partials/profile/spot/view.html',
        controller: 'spotController',
        controllerAs: 'spot',
      })
      .state('main', {
        url: '/main/:mid',
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
        url: '/module/:id',
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
        url: '/content/:tid/:smname',
        templateUrl: 'partials/module/content/view.html',
        controller: 'contentController',
        controllerAs: 'content',
      })
      .state('main.module.content.detail', {
        url: '/detail/:pid/:mname',
        templateUrl: 'partials/module/content/detail/view.html',
        controller: 'detailController',
        controllerAs: 'detail',
      })
      .state('main.module.content.goalprogress', {
        url: '/goalprogress/:pid/:mname',
        templateUrl: 'partials/module/content/goal_progress/view.html',
        controller: 'goalprogressController',
        controllerAs: 'goalprogress'
      })
      .state('main.module.content.goalquater', {
        url: '/goalquater/:pid/:mname',
        templateUrl: 'partials/module/content/goal_quater/view.html',
        controller: 'goalquaterController',
        controllerAs: 'goalquater'
      })
      .state('main.module.content.goalyear', {
        url: '/goalyear/:pid/:mname',
        templateUrl: 'partials/module/content/goal_year/view.html',
        controller: 'goalyearController',
        controllerAs: 'goalyear'
      })
      .state('main.module.content.proceeding', {
        url: '/proceeding/:pid/:mname',
        templateUrl: 'partials/module/content/proceeding/view.html',
        controller: 'proceedingController',
        controllerAs: 'proceeding'
      })
      .state('main.module.content.ecocity', {
        url: '/ecocity/:pid/:mname',
        templateUrl: 'partials/module/content/eco_city/view.html',
        controller: 'ecocityController',
        controllerAs: 'ecocity'
      })
      .state('main.module.content.ecocounty', {
        url: '/ecocounty/:pid/:mname',
        templateUrl: 'partials/module/content/eco_county/view.html',
        controller: 'ecocountyController',
        controllerAs: 'ecocounty'
      })
      .state('main.module.content.ecogdp', {
        url: '/ecogdp/:pid/:mname',
        templateUrl: 'partials/module/content/eco_gdp/view.html',
        controller: 'ecogdpController',
        controllerAs: 'ecogdp'
      })
      .state('main.module.content.projectcity', {
        url: '/projectcity/:pid/:mname',
        templateUrl: 'partials/module/content/project_city/view.html',
        controller: 'projectcityController',
        controllerAs: 'projectcity'
      })
      .state('main.module.content.projectcounty', {
        url: '/projectcounty/:pid/:mname',
        templateUrl: 'partials/module/content/project_county/view.html',
        controller: 'projectcountyController',
        controllerAs: 'projectcounty'
      })


    /** HTTP Interceptor */
    $httpProvider.interceptors.push(interceptor);
    interceptor.$inject = ['$q', '$location', '$injector','deviceService','$cookies'];

    function interceptor($q, $location, $injector,deviceService,$cookies) {
      return {
        'request': function(config) {
          console.log(config.headers["isAjax"]);
          config.withCredentials = true;
          $injector.get('$http').defaults.headers.common['isAjax'] = 'true';

          if (deviceService.isAndroid || deviceService.isPhone) {
            $injector.get('$http').defaults.headers.common['isMobile'] = 'true';
          }
          return config;

        },
        'requestError': function(rejection) {
          return rejection;
        },
        'response': function(response) {
          $cookies.put('cookie',true);
          return response;
        },
        'responseError': function(rejection) {
          $cookies.put('cookie',false);
          $q.when(rejection, function(result) {
            if (rejection && rejection.status === 511) {
              window.location.href = rejection.data.location;
            };
            if (rejection && rejection.status === 404 && rejection.config.url.indexOf('/auth') > -1) {
              window.location.href = './#/profile';
            };
          });
          return rejection;
        }
      };
    };
  };

  runState.$inject = ['$rootScope','$window','deviceService','$cookies'];

  function runState($rootScope,$window,deviceService,$cookies) {
    $rootScope.$on('$stateChangeStart',
      function(event, toState, toParams, fromState, fromParams) {
        if(!deviceService.isAndroid && !deviceService.isPhone && toState.name != 'auth') {
          if(!$cookies.get('cookie')) {
            event.preventDefault();
            $window.location.href = './#/auth';
          }

        }
        if((deviceService.isAndroid || deviceService.isPhone) && toState.name.indexOf('profile')>-1) {
          $window.location.href = './#/home';
        }
      });
  }

})();
