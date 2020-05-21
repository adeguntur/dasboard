var createError = require('http-errors');
var express = require('express');
var session = require('express-session')
var path = require('path');
var flash = require('connect-flash')
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport')
var bodyParser = require('body-parser')

var app = express();

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
// view engine setup
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(session({
  secret: 'thatsecretthinggoeshere',
  resave: false,
  saveUninitialized: true
}));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

app.use(function(req, res, next) {
  let error = req.flash('error');
  res.locals.error = error.length ? error:null;
  let success = req.flash('success');
  res.locals.success = success.length ? success: null;
  //res.locals.message = req.flash('message');
  next();
});

app.use('/', indexRouter);
app.use('/', loginRouter);
require('./config/passport')(passport)

// error handler

module.exports = app;
