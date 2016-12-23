(function() {
  /** Module */
  var main = angular.module('app.main', []);
  /** Controller */
  main.controller('mainController', [
    '$scope', 'mainService','$state','$stateParams',
    function($scope, mainService,$state,$stateParams) {
      var vm = this;
      vm.showMenu = function() {
        $('.side-nav').toggleClass('sidebar-collapse');
        $('.m-header').toggleClass('sidebar-collapse');
        $('.mobile-content').toggleClass('sidebar-collapse');
      }

      var screen_width = screen.width;
      var screen_height = screen.height;
      var main_height = $('.mobile-content').height();
      if(screen_width<1024) { // mobile
        $('.mobile-content').css({'min-height':screen_height+'px'});
      }

      // get menu list
      mainService.getMenus({parentId:"0"}).then(function(result) {
        vm.menus = result.data;
        _.remove(vm.menus,function(item){
          return item.type == '2' || item.type == '3';
        });
        if(screen_width<1200) { // mobile
          var current_menu_index = 0;
          _.forEach(vm.menus,function(menu,index) {
            if(menu.id == $stateParams.mid) {
              current_menu_index = index;
            }
            mainService.getMenus({
              parentId: menu.id
            }).then(function(result) {
              menu.subMenus = result.data;
              if(index == (vm.menus.length-1)){
                console.log(vm.menus[current_menu_index]);
                $state.go('main.module.content',{tid:vm.menus[current_menu_index].subMenus[0].id});
              }
            })
          })

        }
        else{
          $state.go('main.module',{id:$stateParams.mid});
        }
      });

      setTimeout(function(){
        $('#menu').metisMenu();
      },500);
    }
  ]);

  /** Service */
  main.factory('mainService', ['$http', 'URL',
    function($http, URL) {
      return {
        getMenus: getMenus
      }

      function getMenus(params) {
        return $http.get(
          URL + '/main/menu',{
            params: params
          }
        )
      }
    }
  ]);

  main.directive('wiservSideMenu', [
    function() {
      return {
        restrict: 'ACE',
        link: function(scope, element, attrs) {
          console.log(element);
          element.metisMenu({
            preventDefault: false
          });
          element.bind('click',function(ev) {
            ev.stopPropagation();
          })
          // element.sidr({
          //   name: 'sidebar',
          //   side: 'left'
          // });
        }
      }
    }
  ]);

})();
