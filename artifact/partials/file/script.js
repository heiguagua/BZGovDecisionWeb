(function() {
  /** Module */
  var file = angular.module('app.file', []);
  /** Controller */
  file.controller('fileController', [
    '$scope', 'fileService', '$state', '$stateParams', '$uibModal', 'URL',
    function($scope, fileService, $state, $stateParams, $uibModal, URL) {
      var vm = this;
      $scope.Modal = {};
      vm.Paging = {};
      vm.Paging.currentPage = 1;
      vm.Paging.maxSize = 5;
      vm.Paging.itemsPerPage = 10;

      //init
      getFileList();

      vm.showDetail = function(url,id) {
        var modalInstance = $uibModal.open({
          animation: true,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'fileDetail.html',
          scope: $scope,
          size: 'lg'
        });

        // PDFJS.workerSrc = '../libraries/pdf/pdf.worker.js'; //加载核心库
        // PDFJS.getDocument(URL + "/file/download/?id=" + id).then(function getPdfHelloWorld(pdf) {
        //   //
        //   // 获取第一页数据
        //   //
        //   pdf.getPage(1).then(function getPageHelloWorld(page) {
        //     var scale = 1.5;
        //     var viewport = page.getViewport(scale);
        //
        //     //
        //     // Prepare canvas using PDF page dimensions
        //     //
        //     var canvas = document.getElementById('the-canvas');
        //     var context = canvas.getContext('2d');
        //     canvas.height = viewport.height;
        //     canvas.width = viewport.width;
        //
        //     //
        //     // Render PDF page into canvas context
        //     //
        //     var renderContext = {
        //       canvasContext: context,
        //       viewport: viewport
        //     };
        //     page.render(renderContext);
        //   });
        // });

        //$scope.file_url = URL + url;
        $scope.file_url = URL + url + '?id='+id;
        $scope.Modal.close = function() {
          modalInstance.close();
        };
      }

      vm.Paging.pageChanged = function() {
        getFileList();
      }

      function getFileList() {
        fileService.getFileList($stateParams.furl, {
          fileType: 'pdf',
          offset: (vm.Paging.currentPage - 1) * vm.Paging.itemsPerPage,
          limit: vm.Paging.itemsPerPage
        }).then(function(res) {
          vm.fileList = res.data.data;
          vm.Paging.totalItems = res.data.total;
        });
      }

    }
  ]);
  file.filter('trustUrl', ['$sce', function($sce) {
    return function(url) {
      return $sce.trustAsResourceUrl(url);
    };
  }]);
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

      function getFileList(url, params) {
        return $http.get(
          URL + url, {
            params: params
          }
        )
      }
    }
  ]);

})();
