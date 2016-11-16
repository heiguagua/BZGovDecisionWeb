(function() {
  /** Module */
  var detail = angular.module('app.main.module.content.detail', ['ui.bootstrap']);
  /** Controller */
  detail.controller('detailController', [
    '$scope', 'detailService', '$stateParams', 'uibDateParser',
    function($scope, detailService, $stateParams, uibDateParser) {
      var vm = this;

      $scope.popups = [];

      detailService.getContent({
          menuId: $stateParams.pid
        }).then(function(result) {
          vm.content = (result && result.data) ? result.data.body : "";
          _.forEach(vm.content, function(item) {
            var popup = {};
            popup.opened = false;
            popup.url = item.url;
            popup.model = new Date();

            var dateOptions = {};
            dateOptions.formatYear = 'yyyy';
            if (item.queryTime == 'year') {
              popup.format = 'yyyy';
              dateOptions.minMode = 'year';
              dateOptions.datepickerMode = 'year';
            }
            if (item.queryTime == 'month') {
              popup.format = 'yyyy-MM';
              dateOptions.minMode = 'month';
              dateOptions.datepickerMode = 'month';
              popup.model.setMonth(popup.model.getMonth() - 1);
            }
            popup.dateOptions = dateOptions;
            // get detail content
            $scope.popups.push(popup);

            getDetail(item.url, {
              queryTime: getDateFormat(popup.model, popup.format)
            }).then(function(result) {
            });
          });
        })
        //
        // $scope.dateOptions = {
        //   minMode: 'month',
        //   datepickerMode: 'month',
        //   formatYear: 'yyyy',
        //   startingDay: 1
        // };

      $scope.open = function(index) {
        $scope.popups[index].opened = true;
      };

      $scope.changed = function(index) {
        if (!angular.isDate($scope.popups[index].model) || isNaN($scope.popups[index].model.getTime())) {
          alert('请输入正确的日期格式！');
          return;
        }
        else{
          getDetail($scope.popups[index].url, {
            queryTime: getDateFormat($scope.popups[index].model, $scope.popups[index].format)
          });
        }
      }
      $scope.altInputFormats = ['M!/d!/yyyy'];

      function getDetail(url, params) {
        return detailService.getDetail(url, params);
      }

      function getDateFormat(parseDate, format) {
        var date = angular.copy(parseDate);
        if (angular.isDate(date) && !isNaN(date.getTime())) {
          return date.Format(format);
        } else {
          return '';
        }
      }

      Date.prototype.Format = function(fmt) { //author: meizz
        var o = {
          "M+": this.getMonth() + 1, //月份
          "d+": this.getDate(), //日
          "h+": this.getHours(), //小时
          "m+": this.getMinutes(), //分
          "s+": this.getSeconds(), //秒
          "q+": Math.floor((this.getMonth() + 3) / 3), //季度
          "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt))
          fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
          if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
      }
    }
  ]);

  /** Service */
  detail.factory('detailService', ['$http', 'URL',
    function($http, URL) {
      return {
        getContent: getContent,
        getDetail: getDetail
      }

      function getContent(params) {
        return $http.get(
          URL + '/main/showPics', {
            params: params
          }
        )
      }

      function getDetail(detailUrl, params) {
        return $http.get(
          URL + detailUrl, {
            params: params
          }
        )
      }
    }
  ]);

})();
