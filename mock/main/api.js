const Router = require('express').Router(),
      Util = require('../common/util.js');
/** Router definition */
Router.route('/main/menu')
  .get(function(request, response) {
    response.json(Util.json('/main/json/menu.json'));
});
Router.route('/main/showPics')
  .get(function(request, response) {
    response.json(Util.json('/main/json/showPics.json'));
});
Router.route('/main/detail')
  .get(function(request, response) {
    response.json(Util.json('/main/json/detailPie.json'));
});
Router.route('/file/list')
  .get(function(request, response) {
    response.json(Util.json('/main/json/file.json'));
});
Router.route('/table/data')
  .get(function(request, response) {
    response.json(Util.json('/main/json/tableData.json'));
});
/** Module export */
module.exports = Router;
