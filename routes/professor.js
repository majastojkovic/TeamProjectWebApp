const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

const Student = require('../models/Student.js');
const Professor = require('../models/Professor.js');
const Theme = require('../models/Theme.js');
const Team = require('../models/Team.js');

// Professor Dashboard
router.get('/professorHome', ensureAuthenticated, (req, res) => res.render('professordashboard'));


router.get('/professorProfile', (req, res) => res.render('professorProfile'));


router.get('/theme/:title?', ensureAuthenticated, (req, res) => {

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

router.post('/approveTheme', (req, res, next) => {

   let prosledjeno = req.body.checkedTeam;

   let timITema = prosledjeno.split(',');

   // nasla sam tim kome treba da se dodeli tema
   Team.findOne({ name: timITema[0] }, function(err, teamApproved) {

     Theme.findOneAndUpdate({ title: timITema[1] }, { isAvailable: false, teamsApplied: null, teamApproved: teamApproved._id }, function(err, theme) {

       theme.teamsApplied.forEach(teamObjectId => {
         // svi timovi mogu da se ponovo prijave na neku temu
         Team.findOneAndUpdate({ _id: teamObjectId }, { isApplied: false }, function(err, team) {});
       });

       // ovaj kome je odobrena tema, promeni polja
       Team.findOneAndUpdate({ name: timITema[0] }, { chosenTheme: theme._id, isApplied: true },  function(err, team) { });

     });

   });

   res.redirect('/professor/theme/' + timITema[1]);
});

module.exports = router;
