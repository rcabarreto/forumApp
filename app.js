'use strict';

require('./polyfills');

const express = require('express');
const path = require('path');
const helmet = require('helmet');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const sassMiddleware = require('node-sass-middleware');
const schedule = require('node-schedule');

const db = require('./db');

const exphbs = require('express-handlebars');
const HandlebarsIntl = require('handlebars-intl');
const hbsHelpers = require('./lib/helpers');

const middleware = require('./middleware')(db);

const index = require('./routes/index')(db, middleware);

const app = express();

app.set('default locale', 'pt-BR');


// configure headers
app.use(helmet());
app.disable('x-powered-by');


// view engine setup
let hbs = exphbs.create({
  extname: '.hbs',
  defaultLayout: 'layout',
  helpers: hbsHelpers,
  partialsDir: ['views/partials/']
});
app.engine(hbs.extname, hbs.engine);
app.set('view engine', hbs.extname);
HandlebarsIntl.registerWith(hbs.handlebars);


// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false,
  sourceMap: true
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(middleware.intl);

app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// sync the database
db.sequelize.sync().then(function() {
  // {force:true}

});

module.exports = app;
