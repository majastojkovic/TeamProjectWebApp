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

   let temaITim = prosledjeno.split(',');

   // 1. team.chosenTheme=theme.title
   Team.findOne({ name: temaITim[0] }, function(err, team) {

     // 2. theme.isAvailable:false
     // 3. theme.teamsApplied=null
     // 4. theme.teamApproved=team._id

     // 5. NIJE URADJENO: Prodji kroz sve ostale timove i postavi im isApplied: false da bi mogli da se prijave za neku drugu
     // 5.1 Theme.find - tu temu
     // 5.2 izvuci theme.teamsApplied (element je objectId)
     // 5.3 theme.teamsApplied.forEach(teamObjectId => {
     //         Team.findOneAndUpdate({ _id: teamObjectId }, { isApplied: false },  function(err, team) { });
    //  })
     Theme.findOneAndUpdate({ title: temaITim[1] }, {isAvailable: false, teamsApplied: null, teamApproved: team._id }, function(err, theme) {

       Team.findOneAndUpdate({ name: temaITim[0] }, { chosenTheme: theme._id },  function(err, team) { });

     });

   });


   // {chosenTheme: temaITim[1]}

   res.redirect('/professor/theme/' + temaITim[1]);
});

module.exports = router;
