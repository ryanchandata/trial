let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let cors = require('cors');

//* modules for authentication
let session = require('express-session');
let passport = require('passport');

let passportJWT = require('passport-jwt');
let JWTStrategy = passportJWT.Strategy;
let ExtractJWT = passportJWT.ExtractJwt;

let passportLocal = require('passport-local');
let localStrategy = passportLocal.Strategy;
let flash = require('connect-flash');

// database setup

let mongoose = require('mongoose');
let DB = require('./db');

// point mongoose to the db URI
mongoose.connect(DB.URI, {useNewUrlParser: true, useUnifiedTopology: true} ); // connects to MongoDB Atlas

// configuring connection listeners
let mongoDB = mongoose.connection;
mongoDB.on('error', console.error.bind(console, 'Connection Error: ')); // if there is a connection error, this will send an error message to the console
mongoDB.once('open', ()=> {
  console.log('Connected to MongoDB...');
});

let indexRouter = require('../routes/index');
let usersRouter = require('../routes/users');
let surveysRouter = require('../routes/surveys');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.static(path.join(__dirname, '../../node_modules')));

app.use(cors());

//* setup express session
app.use(session({
  secret: "SomeSecret",
  saveUninitialized: false,
  resave: false
}));

// initialize flash
app.use(flash());

//* initialize passport
app.use(passport.initialize());
app.use(passport.session());

//* create a User Model Instance
let userModel = require('../models/user');
let User = userModel.User;

//* implement a User Authentication Strategy
passport.use(User.createStrategy());

//* serialize and deserialize the User info
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//* To verify whether the token is being sent by the user and is valid*/
let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = DB.Secret;

//* find user from database
let strategy = new JWTStrategy(jwtOptions, (jwt_payload, done) => {
  User.findById(jwt_payload.id)
  .then(user => {
    return done(null, user);
  })
  .catch(err => {
    return done(err, false);
  })
});

passport.use(strategy);

// routing
app.use('/api', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/surveys', surveysRouter);
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/index.html"));
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
