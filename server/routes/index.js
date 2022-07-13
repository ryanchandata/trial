const express = require('express');
const router = express.Router();
const indexController = require('../controllers/index');
const jwt = require('jsonwebtoken');
const passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* POST Route for processing the Login page */
router.post('/login', indexController.processLoginPage);

/* POST Route for processing the Register page */
router.post('/register', indexController.processRegisterPage);

/* POST Route for processing the Register page */
router.post('/update', passport.authenticate('jwt', {session: false}), indexController.processUpdateUser);

/* GET to perform UserLogout */
router.get('/logout', indexController.performLogout);

module.exports = router;
