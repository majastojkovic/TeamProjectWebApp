const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

const Student = require('../models/Student.js');
const Professor = require('../models/Professor.js');
const Theme = require('../models/Theme.js');
const Team = require('../models/Team.js');

// Professor Dashboard
router.get('/professorHome', ensureAuthenticated, (req, res) => res.render('professordashboard'));

//route to professorProfile.ejs
router.get('/professorProfile', (req, res) => res.render('professorProfile'));

// OVO TREBA DA OBRISEM KAD POSTAVLJAM
// sad mi treba zbog ispitivanja prikaza
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

/*
$("input:checkbox").on('click', function() {
  var $box = $(this);
  if ($box.is(":checked")) {
    var group = "input:checkbox[name='" + $box.attr("name") + "']";
    $(group).prop("checked", false);
    $box.prop("checked", true);
  } else {
    $box.prop("checked", false);
  }
});
*/

router.post('/approveTheme', (req, res, next) => {

   let prosledjeno = req.body.checkedTeam;

   let temaITim = prosledjeno.split(',');

   // 1. team.chosenTheme=theme.title
   Team.findOne({ name: temaITim[0] }, function(err, team) {

     // theme.isAvailable:false
     // theme.teamsApplied=null
     // theme.teamApproved=team._id
     Theme.findOneAndUpdate({ title: temaITim[1] }, {isAvailable: false, teamsApplied: null, teamApproved: team._id }, function(err, theme) {

       Team.findOneAndUpdate({ name: temaITim[0] }, { chosenTheme: theme._id },  function(err, team) { });

     });

   });


   // {chosenTheme: temaITim[1]}

   res.redirect('/professor/theme/' + temaITim[1]);
});

module.exports = router;
