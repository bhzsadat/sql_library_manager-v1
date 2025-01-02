
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var logger = require('morgan');
const { sequelize, Book } = require('./models');

var indexRouter = require('./routes/book');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const error = new Error('Sorry! We couldn\'t find the page you were looking for.');
  error.status = 404;
  res.status(404).render('page-not-found', { error });
});

// error handler
app.use((err, req, res, next) => {
  err.status = err.status || 500;
  err.message = err.message || 'Sorry! There was an unexpected error on the server.';
  
  console.error(`Error status: ${err.status}, message: ${err.message}`);
  
  res.status(err.status);
  res.render('error', { err });
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');
    await sequelize.sync();
    console.log('Database synced successfully.');
  } catch (error) {
    console.error('Error during sync:', error);
  }
})();




module.exports = app;
