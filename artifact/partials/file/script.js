(function() {
  /** Module */
  var file = angular.module('app.file', []);
  /** Controller */
  file.controller('fileController', [
    '$scope', 'fileService', '$state', '$stateParams', '$uibModal',
    function($scope, fileService, $state, $stateParams, $uibModal) {
      var vm = this;
      $scope.Modal = {};
      vm.Paging = {};
      vm.Paging.currentPage = 1;
      vm.Paging.maxSize = 5;
      vm.Paging.itemsPerPage = 10;

      //init
      getFileList();

      vm.showDetail = function(url) {
        var modalInstance = $uibModal.open({
          animation: true,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'fileDetail.html',
          scope: $scope,
          size: 'lg'
        });
        $scope.file_url = url;
        $scope.Modal.close = function() {
          modalInstance.close();
        };
      }

      vm.Paging.pageChanged = function() {
        getFileList();
      }

      function getFileList() {
        fileService.getFileList($stateParams.furl,{fileType:'pdf',offset:(vm.Paging.currentPage-1)*vm.Paging.itemsPerPage,limit:vm.Paging.itemsPerPage}).then(function(res) {
          vm.fileList = (res && res.data) ? res.data.body[0].data : "";
          vm.Paging.totalItems = res.data.body[0].total;
        });
      }

    }
  ]);

  /** Service */
  file.factory('fileService', ['$http', 'URL',
    function($http, URL) {
      return {
        getMenus: getMenus,
        getFileList: getFileList
      }

      function getMenus(params) {
        return $http.get(
          URL + '/main/menu', {
            params: params
          }
        )
      }

      function getFileList(url,params) {
        return $http.get(
          URL + url,{params:params}
        )
      }
    }
  ]);

})();