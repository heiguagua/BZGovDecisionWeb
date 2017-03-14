(function() {
  /** Module */
  var main = angular.module('app.main', []);
  /** Controller */
  main.controller('mainController', [
    '$scope', 'mainService', '$state', '$stateParams',
    function($scope, mainService, $state, $stateParams) {
      var vm = this;
      vm.showMenu = function() {
        $('.side-nav').toggleClass('sidebar-collapse');
        $('.m-header').toggleClass('sidebar-collapse');
        $('.mobile-content').toggleClass('sidebar-collapse');
      }

      vm.hideMenu = function() {
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
        if (screen_width < 1024) { // mobile
          _.remove(vm.menus, function(item) {
              return item.name == '首页' || item.name == '经济概况' || item.name == '精准扶贫' || item.name == '经济形势分析';
          });
        }
        else{
          _.remove(vm.menus, function(item) {
              return item.name == '首页' || item.name == '经济概况' || item.name == '精准扶贫' ||  item.name == '经济形势分析';
          });
        }

        if (screen_width < 1024) { // mobile
          var current_menu_index = 0;
          mainService.getSubMenus(vm.menus).then(function(res) {
            _.forEach(vm.menus, function(menu, index) {
              menu.subMenus = res[index];
              if (menu.id == $stateParams.mid) {
                current_menu_index = index;
              }
            });
          }).then(function(){
            $state.go('main.module.content', {
              tid: vm.menus[current_menu_index].subMenus[0].id
            });
          });


        } else {
          $state.go('main.module', {
            id: $stateParams.mid
          });
        }



      });

      setTimeout(function() {
        $('#menu').metisMenu();
      }, 500);
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

  // main.directive('wiservSideMenu', [
  //   function() {
  //     return {
  //       restrict: 'ACE',
  //       link: function(scope, element, attrs) {
  //         console.log(element);
  //         element.metisMenu({
  //           preventDefault: false
  //         });
  //         element.bind('click', function(ev) {
  //             ev.stopPropagation();
  //           })
  //           // element.sidr({
  //           //   name: 'sidebar',
  //           //   side: 'left'
  //           // });
  //       }
  //     }
  //   }
  // ]);

})();
