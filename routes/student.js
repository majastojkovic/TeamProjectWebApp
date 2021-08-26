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

      if (req.user.teamName == null) {
        // Student nema tim
        res.render('studentdashboard', {
              student: req.user,
              themes: themes
          });

      } else {
        // Student ima tim
        Team.findOne({ name: req.user.teamName }, function(err, team) {

          // da li tim vec ima odabranu TEMU
          if(team.chosenTheme != null ) {

            // tim ima temu, prikazi mu je
            Theme.findOne({ _id: team.chosenTheme }, function(err, theme) {

              res.render('studentdashboard', {
                    student: req.user,
                    themes: themes,
                    chosenTheme: theme,
                    team: team
                });

            });

          } else if (team.isApplied == true && team.chosenTheme == null) {
            // tim se prijavio za neku temu,ceka da mu se odobri, nadji za koju
            // ili da mu se odobri ako se prijavio (nalazi se u listi)

            themes.forEach(function(theme) {
              // prodji kroz svaku temu i kroz svaku listu
              var today = new Date();
              if (theme.expiryDate >= today && theme.isAvailable == true) {
                // pristupam samo dostupnim temama
                if(theme.teamsApplied.includes(team._id)) {
                  // za ovu temu se prijavio tim, prosledi mu je

                  res.render('studentdashboard', {
                        student: req.user,
                        themes: themes,
                        team: team,
                        appliedTheme: theme

                    });
                }
              }

            });

          } else {
            // tim nema temu, treba da izabere
            res.render('studentdashboard', {
                  student: req.user,
                  themes: themes,
                  team: team
              });
          }

        });

      }

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
    //console.log("Clan koji zeli da napusti: " + student._id);
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
      //  console.log("Sva tri clana : " + team.members); // na neku cudnu foru izbaci onog ko je kliknuo Leave team
      //  console.log("Oni koji su ostali: " + teamMembers);

        Team.findOneAndUpdate( { _id: team._id }, { members: teamMembers, numberOfMembers: newNumberOfMembers }, function(err, student) { });

      }


    });


  });

  res.redirect('/student/studentProfile');

});

router.post('/applyForTheme', (req, res, next) => {
   // console.log(req.body.button); naziv teme koja je kliknuta
   // console.log(req.user);

   // 1. nadji tim i postavi isApplied: true
   Team.findOneAndUpdate({ name: req.user.teamName },  { isApplied: true }, function(err, team) {

     //console.log("Tema " + req.body.button);
     //console.log("Tim id: " + team._id);
     // 2. nadji temu i dodaj team._id u teamsApplied

      Theme.findOne({ title: req.body.button }, function(err, theme) {

        theme.teamsApplied.push(team._id);

        Theme.findOneAndUpdate({ title: theme.title }, { teamsApplied: theme.teamsApplied }, function(err, updatedTheme) {});

          // Kad se prijavi za temu, vodi ga da vidi informacije o temi
          res.redirect('/student/theme/' + theme.title);

      });

    });

  //  res.redirect('/student/studentProfile');

});


module.exports = router;
