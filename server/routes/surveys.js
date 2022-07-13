/* GET home page. */
const express = require('express');
const router = express.Router();
const surveyController = require('../controllers/survey');
const jwt = require('jsonwebtoken');
const passport = require('passport');

// GET List of surveys
router.get('/', surveyController.getSurveys);

// GET survey by id
router.get('/:id', surveyController.getSurvey);

// POST update survey by id 
router.post('/take/:id', surveyController.takeSurvey);

// POST add survey
router.post('/add', passport.authenticate('jwt', {session: false}), surveyController.addSurvey);

// POST update survey by id 
router.post('/update/:id', passport.authenticate('jwt', {session: false}), surveyController.updateSurvey);

// POST delete survey by id
router.post('/delete', passport.authenticate('jwt', {session: false}), surveyController.deleteSurvey);


module.exports = router;