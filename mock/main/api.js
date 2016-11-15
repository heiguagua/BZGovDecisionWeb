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
/** Module export */
module.exports = Router;
