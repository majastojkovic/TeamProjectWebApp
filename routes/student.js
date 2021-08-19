const express = require('express');
const router = express.Router();
const {
  ensureAuthenticated
} = require('../config/auth');

const Student = require('../models/Student.js');
const Professor = require('../models/Professor.js');
const Theme = require('../models/Theme.js');
const Team = require('../models/Team.js');

// Student Dashboard
router.get('/studentHome', ensureAuthenticated, (req, res) => {
    Theme.find(function(err, themes) {
      res.render('studentdashboard', {
            student: req.user,
            themes: themes
        });
    });
});


// Student Profile
router.get('/studentProfile', ensureAuthenticated, (req, res) =>
  res.render('studentProfile', {
    student: req.user // prenosi se student kao objekat iz baze
  }));

// Theme
router.get('/theme/:title?', ensureAuthenticated, (req, res) => {

    Theme.findOne({ title: req.params.title }, function(err, theme) {

      Professor.findOne({ _id: theme.professor }, function(err, professor) {

        res.render('theme', {
              user: req.user,
              theme: theme,
              professor: professor
        });

      });

    });

});

router.post('/leaveTeam', (req, res, next) => {

  Student.findOneAndUpdate({ email: req.user.email }, { teamName: "" }, function(err, student) {
    console.log("Clan koji zeli da napusti: " + student._id);
    Team.findOne({ name: student.teamName }, function(err, team) {
      let teamMembers = team.members;

      const index = teamMembers.indexOf(student._id);
      if (index > -1) {
        teamMembers.splice(index, 1);
      }

      // ovu promenjlivu dodeljujem kada updatujem tim
      const newNumberOfMembers = team.numberOfMembers - 1;
      if (newNumberOfMembers == 1) {

        // 1. kod studenta koji je ostao sam, postavi student.teamName=""
        Student.findOneAndUpdate( { _id: teamMembers[0] }, { teamName: "" }, function(err, student) { });

        // 2. kod teme theme.teamApproved={}
        // 3. kod teme theme.isAvailable="true"
        if (team.chosenTheme != null ) {
          //  postoji tema, "oslobodi" je
          Theme.findOneAndUpdate( { _id : team.chosenTheme }, { teamApproved: null, isAvailable: true }, function(err, student) { });
        }

        // 4. obrisi tim
        Team.deleteOne({ _id: team._id }, function (err) { });

      } else {
        // ostalo 2 ili 3 studenta
        // 1. proci kroz team.members i obrisati student._id
        // 2. kod tima,  numberOfMembers=members.length
        console.log("Sva tri clana : " + team.members); // na neku cudnu foru izbaci onog ko je kliknuo Leave team
        console.log("Oni koji su ostali: " + teamMembers);

        Team.findOneAndUpdate( { _id: team._id }, { members: teamMembers, numberOfMembers: newNumberOfMembers }, function(err, student) { });

      }


    });


  });

  res.redirect('/student/studentHome');

});

// -----------------------------------------------------------------------------------------------------------------

// -----------------------------------------------------------------------------------------------------------------
module.exports = router;
