const Express = require('express'),
      App = Express(),
      Cors = require('cors'),
      BodyParser = require('body-parser'),
      Middleware = require('./common/middleware.js'),
      Color = require('colors/safe');

/** Middlewares */
App.use('/dev', Express.static('./artifact'));
App.use('/pro', Express.static('./release'));
App.use(Cors({
  origin: '*',
  methods: 'GET, POST, PUT, DELETE, OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization','Accept-Ranges','isAjax','isMobile'],
  credentials: true,
  maxAge: 1728000
}));
App.use(BodyParser.json());
App.use('/', (request, response, next) => {
  Middleware.log(request, response);
  next();
});
App.listen(5353);

/* Informations */
console.info(Color.blue('Livereload  started on http://localhost:5252'));
console.info(Color.blue('Development started on http://localhost:5353/dev'));
console.info(Color.blue('Production  started on http://localhost:5353/pro'));

/** Routers */
App.use('/', require('./dashboard/api'));
App.use('/', require('./main/api'));
App.use('/', require('./login/api'));
