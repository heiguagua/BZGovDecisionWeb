const Router = require('express').Router(),
      Util = require('../common/util.js');
/** Router definition */
Router.route('/dashboard/data')
  .get(function(request, response) {
    response.json(Util.json('/dashboard/json/data.json'));
});
/** Module export */
module.exports = Router;
