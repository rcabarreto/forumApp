

require('./polyfills');

const express = require('express');
const path = require('path');
const helmet = require('helmet');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const sassMiddleware = require('node-sass-middleware');

const exphbs = require('express-handlebars');
const handlebars = require('handlebars');
const HandlebarsIntl = require('handlebars-intl');
const db = require('./db');
const hbsHelpers = require('./lib/helpers')(handlebars);

const middleware = require('./middleware')(db);

const index = require('./routes/index')(db, middleware);
const user = require('./routes/user')(db, middleware);
const account = require('./routes/account')(db, middleware);
const forum = require('./routes/forum')(db, middleware);
const topic = require('./routes/topic')(db, middleware);
const post = require('./routes/post')(db, middleware);

const app = express();


app.set('default locale', 'en-US');


// configure headers
app.use(helmet());
app.disable('x-powered-by');


// view engine setup
const hbs = exphbs.create({
  extname: '.hbs',
  defaultLayout: 'layout',
  helpers: hbsHelpers,
  partialsDir: ['views/partials/'],
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
  sourceMap: true,
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(middleware.intl);
app.use(middleware.loadNavigation);

app.use('/', middleware.verifyAuthentication, index);
app.use('/user', user);
app.use('/account', account);
app.use('/forum', forum);
app.use('/topic', topic);
app.use('/post', post);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// sync the database
db.sequelize.sync();

module.exports = app;
