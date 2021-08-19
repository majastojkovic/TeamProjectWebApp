const express = require('express');
const router = express.Router();
const { ensureAuthenticatedProfessor } = require('../config/auth');
const { ensureAuthenticated } = require('../config/auth');
const Student = require('../models/Student.js');
const Professor = require('../models/Professor.js');
const Theme = require('../models/Theme.js');
const Team = require('../models/Team.js');


// Professor Dashboard
router.get('/professorHome', ensureAuthenticatedProfessor , (req, res) => {
    Theme.find(function(err, themes) {
      res.render('professordashboard', {
            professor: req.user,
            themes: themes
        });
    });
});

router.get('/professorProfile', ensureAuthenticatedProfessor, (req, res) => res.render('professorProfile', { professor: req.user }));

router.get('/theme/:title?', (req, res) => {

    Theme.findOne({ title: req.params.title }, function(err, theme) {

      Professor.findOne({ _id: theme.professor }, function(err, professor) {

        Team.find({ _id: { $in : theme.teamsApplied } }, function(err, teams) {

          res.render('theme', {
             user: req.user,
             theme: theme,
             professor: professor,
             teams: teams
           });


        });

      });

    });

});

router.get('/createNewTheme', ensureAuthenticatedProfessor, (req, res) => res.render('createTheme', { professor: req.user }));


router.post('/createTheme', ensureAuthenticatedProfessor, (req, res) => {
  const {
    title,
    description,
    expiryDate
  } = req.body;
  let errors = [];
  let isAvailable = true;
  const professor =req.user._id;
  let teamsApplied =[];
  let teamApproved =null;

  if (!title || !description || !expiryDate) {
    errors.push({
      msg: 'Please fill in all fields.'
    });

    const newTheme = new Theme({
      errors,
      title,
      description,
      expiryDate,
      isAvailable,
      professor,
      teamsApplied,
      teamApproved
    });

    newTheme.save();
    res.redirect('/professorHome');

  }
});
//route to professorProfile.ejs
//router.get('/', ensureAuthenticated, (req, res) => res.render(''))
module.exports = router;
