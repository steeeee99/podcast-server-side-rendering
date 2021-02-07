'use strict';

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fileUpload = require('express-fileupload');
const moment = require('moment');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

const seriesRouter = require('./routes/series');
const favoriteEpisodesRouter = require('./routes/favorite-episodes');
const episodesCreatedRouter = require('./routes/episodes-created');
const seriesCreatedRouter = require('./routes/series-created');
const seriesFollowedRouter = require('./routes/series-followed');
const commentsRouter = require('./routes/comments');
const purchasedEpisodesRouter = require('./routes/purchased-episodes');
const episodesRouter = require('./routes/episodes');
const usersRouter = require('./routes/users');
const sessionRouter = require('./routes/session');

const userDao = require('./models/user-dao.js');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(fileUpload());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


passport.use(new LocalStrategy(
  function(username, password, done) {
    userDao.getUser(username, password).then(({user, check}) => {
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!check) {

        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    })
  }
  ));
  
  // serialize and de-serialize the user (user object <-> session)
  passport.serializeUser(function(user, done) {
    done(null, user.username);
  });
  
  passport.deserializeUser(function(username, done) {
    userDao.getUserByUsername(username).then(user => {
      done(null, user);
    });
  });
  
  // set up the session
  app.use(session({
  //store: new FileStore(), // by default, Passport uses a MemoryStore to keep track of the sessions - if you want to use this, launch nodemon with the option: --ignore sessions/
  secret: 'a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie',
  resave: false,
  saveUninitialized: false 
}));

// init passport
app.use(passport.initialize());
app.use(passport.session());

const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    next();
  }else {
    res.redirect('/login');
}};

const isCreator = (req, res, next) => {
  if(req.user.creator) {
    next();
  }else {
    app.locals.message = 'Errore! Devi essere un utente creatore';
    app.locals.color = 'danger';
    res.redirect('/');
}};

app.use('/', sessionRouter);
app.use('/', seriesRouter); 
app.use('/episodes', episodesRouter); 
app.use('/followed',isLoggedIn, seriesFollowedRouter);
app.use('/users',isLoggedIn, usersRouter);
app.use('/episodes/purchased',isLoggedIn, purchasedEpisodesRouter);
app.use('/episodes',isLoggedIn, commentsRouter);
app.use('/episodes/favorite',isLoggedIn, favoriteEpisodesRouter);
app.use('/created',isLoggedIn,isCreator, seriesCreatedRouter);
app.use('/episodes',isLoggedIn,isCreator, episodesCreatedRouter);


app.use(function (req, res, next) {
  app.locals.color = '';
  app.locals.message = '';
  app.locals.title = '';
  app.locals.active = '';
  app.locals.previousPage = '';
  next();
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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


module.exports = app;
