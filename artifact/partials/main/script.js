(function() {
  /** Module */
  var main = angular.module('app.main', []);
  /** Controller */
  main.controller('mainController', [
    '$scope', 'mainService', '$state', '$stateParams', '$window', 'URL',
    function($scope, mainService, $state, $stateParams, $window, URL) {
      var vm = this;
      vm.logout_href = URL + '/ssoClientOnLoginOut.success';
      vm.showMenu = function($event) {
        $event.stopPropagation();
        $('.side-nav').toggleClass('sidebar-collapse');
        $('.m-header').toggleClass('sidebar-collapse');
        $('.mobile-content').toggleClass('sidebar-collapse');
      }



      vm.hideMenu = function($event) {
        $event.stopPropagation();
        $('.side-nav').removeClass('sidebar-collapse');
        $('.m-header').removeClass('sidebar-collapse');
        $('.mobile-content').removeClass('sidebar-collapse');
      }

      var screen_width = screen.width;
      var screen_height = screen.height;
      var client_width = document.body.clientWidth;
      var main_height = $('.mobile-content').height();
      $scope.showMobile = false;
      if (screen_width < 1024 || client_width < 1024) { // mobile
        $scope.showMobile = true;
        $('.mobile-content').css({
          'min-height': screen_height + 'px'
        });
      }

      // get menu list
      mainService.getMenus({
        parentId: "0"
      }).then(function(result) {
        vm.menus = result.data;
        if (screen_width < 1024 || client_width < 1024) { // mobile
          _.remove(vm.menus, function(item) {
            return item.name == '首页' || item.name == '经济概况' || item.name == '精准扶贫' || item.name == '经济形势分析';
          });
        } else {
          _.remove(vm.menus, function(item) {
            return item.name == '首页' || item.name == '经济概况' || item.name == '精准扶贫' || item.name == '经济形势分析';
          });
        }

        if (screen_width < 1024 || client_width < 1024) { // mobile
          var current_menu_index = 0;
          mainService.getSubMenus(vm.menus).then(function(res) {
            _.forEach(vm.menus, function(menu, index) {
              menu.subMenus = res[index];
              if (menu.id == $stateParams.mid) {
                current_menu_index = index;
              }
            });
          }).then(function() {
            $state.go('main.module.content', {
              tid: vm.menus[current_menu_index].subMenus[0].id,
              smname: vm.menus[current_menu_index].subMenus[0].name
            }, {
              location: 'replace'
            });
          });

          var main = document.getElementById("mobileContent");
          var inlit_x = 0; //滑动起始点
          var move_len = 0; //移动距离
          main.addEventListener("touchstart", function(event) {
            event.stopPropagation();
            move_len = 0;
            inlit_x = event.targetTouches[0].pageX; //获取初始滑动X值
          });
          main.addEventListener("touchmove", function(event) {
            event.stopPropagation();
            var move_x = event.targetTouches[0].pageX; //运动滑动X值
            move_len = move_x - inlit_x;

            // if(move_len>0){
            // 	main.style.marginLeft = move_len+"px";
            // }
          });
          main.addEventListener("touchend", function(event) {
            event.stopPropagation();
            if (move_len == 0) {

            } else {
              if (move_len >= 50) {
                console.log('you');
                $("#mobileContent").addClass('sidebar-collapse');
                $(".side-nav").addClass('sidebar-collapse');
                $(".m-header").addClass('sidebar-collapse');
              } else {
                console.log('mei');
                $("#mobileContent").removeClass('sidebar-collapse');
                $(".side-nav").removeClass('sidebar-collapse');
                $(".m-header").removeClass('sidebar-collapse');
              }
            }

          });

        } else {
          $state.go('main.module', {
            id: $stateParams.mid
          }, {
            location: 'replace'
          });
        }



      });

      setTimeout(function() {
        $('#menu').metisMenu();
      }, 500);

      angular.element($window).bind('resize', function() {
        var screen_width = screen.width;
        var client_width = document.body.clientWidth;
        if (screen_width < 1024 || client_width < 1024) { // mobile
          $scope.showMobile = true;
          $('.mobile-content').css({
            'min-height': screen_height + 'px'
          });

          var current_menu_index = 0;
          mainService.getSubMenus(vm.menus).then(function(res) {
            _.forEach(vm.menus, function(menu, index) {
              menu.subMenus = res[index];
            });
          }).then(function() {
            setTimeout(function() {
              $('#menu').metisMenu();
            }, 500);
            // $state.go('main.module.content', {
            //   tid: vm.menus[current_menu_index].subMenus[0].id
            // });
          });
        } else {
          $scope.$applyAsync(function() {
            $scope.showMobile = false;
          })
        }
      })
    }
  ]);

  /** Service */
  main.factory('mainService', ['$http', 'URL', '$q',
    function($http, URL, $q) {
      return {
        getMenus: getMenus,
        getSubMenus: getSubMenus
      }

      function getMenus(params) {
        return $http.get(
          URL + '/main/menu', {
            params: params
          }
        )
      }

      function getSubMenus(params) {

        var promises = [];
        angular.forEach(params, function(data) {
          var param = {
            parentId: data.id
          };
          var promise = $http.get(
            URL + '/main/menu', {
              params: param
            }
          ).then(function(result) {
            return result.data;
          })
          promises.push(promise);
        });
        return $q.all(promises);
      }
    }
  ]);

})();
