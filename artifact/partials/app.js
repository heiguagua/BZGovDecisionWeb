(function() {

  angular.module('app', [
      'ui.router',
      'common.http',
      'app.dashboard',
      'app.login',
      'app.main',
      'app.home',
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
    ])
    .config(config);

  config.$inject = ['$stateProvider', '$urlRouterProvider', '$httpProvider'];

  function config($stateProvider, $urlRouterProvider, $httpProvider) {
    /** UI-Router Config */
    $urlRouterProvider.otherwise('/profile');
    var screen_width = screen.width;
    if (screen_width < 1024) {
      $urlRouterProvider.otherwise('/home');
    } else {
      $urlRouterProvider.otherwise('/profile');
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
        url: '/content/:tid',
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
      .state('main.module.content.goalprogress',{
        url: '/goalprogress/:pid/:mname',
        templateUrl: 'partials/module/content/goal_progress/view.html',
        controller: 'goalprogressController',
        controllerAs: 'goalprogress'
      })
      .state('main.module.content.goalquater',{
        url: '/goalquater/:pid/:mname',
        templateUrl: 'partials/module/content/goal_quater/view.html',
        controller: 'goalquaterController',
        controllerAs: 'goalquater'
      })
      .state('main.module.content.goalyear',{
        url: '/goalyear/:pid/:mname',
        templateUrl: 'partials/module/content/goal_year/view.html',
        controller: 'goalyearController',
        controllerAs: 'goalyear'
      })
      .state('main.module.content.proceeding',{
        url: '/proceeding/:pid/:mname',
        templateUrl: 'partials/module/content/proceeding/view.html',
        controller: 'proceedingController',
        controllerAs: 'proceeding'
      })
      .state('main.module.content.ecocity',{
        url: '/ecocity/:pid/:mname',
        templateUrl: 'partials/module/content/eco_city/view.html',
        controller: 'ecocityController',
        controllerAs: 'ecocity'
      })
      .state('main.module.content.ecocounty',{
        url: '/ecocounty/:pid/:mname',
        templateUrl: 'partials/module/content/eco_county/view.html',
        controller: 'ecocountyController',
        controllerAs: 'ecocounty'
      })
      .state('main.module.content.ecogdp',{
        url: '/ecogdp/:pid/:mname',
        templateUrl: 'partials/module/content/eco_gdp/view.html',
        controller: 'ecogdpController',
        controllerAs: 'ecogdp'
      })
      .state('main.module.content.projectcity',{
        url: '/projectcity/:pid/:mname',
        templateUrl: 'partials/module/content/project_city/view.html',
        controller: 'projectcityController',
        controllerAs: 'projectcity'
      })
      .state('main.module.content.projectcounty',{
        url: '/projectcounty/:pid/:mname',
        templateUrl: 'partials/module/content/project_county/view.html',
        controller: 'projectcountyController',
        controllerAs: 'projectcounty'
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
          // var box_height = $('.content-main').height();
          // console.log(screen_height);
          // console.log(box_height);
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
