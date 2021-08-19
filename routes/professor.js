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

module.exports = router;
