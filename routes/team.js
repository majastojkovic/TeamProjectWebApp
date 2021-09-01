const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const {
  ensureAuthenticated
} = require('../config/auth');
const { ensureAuthenticatedStudent } = require('../config/auth');

const Theme = require('../models/Theme.js');
const Team = require('../models/Team.js');
const Student = require('../models/Student.js');
const router = express.Router();



router.get('/team', ensureAuthenticated, (req, res) => {
  Team.findOne({
    name: req.user.teamName
  }, function(err, team) {
    Student.find({
      teamName: team.name
    }, function(err, students) {

      res.render('team', {
        user: req.user,
        team: team,
        students: students
      });
    });
  });
});

router.post('/createTeam',  ensureAuthenticatedStudent,(req, res, err) => {
  const emails = req.body.members;
  const name = req.body.name;
  var members = [];
  var i = 0;
  let errors = [];
  let isApplied = false;
  let numberOfMembers = 0;
  let chosenTheme = null;

  let separatedEmails = "";
  separatedEmails = emails.split(',');
  console.log(separatedEmails);

  members.push(req.user._id);
  numberOfMembers++;

  if (req.user.teamName != null) {
    errors.push({
      msg: 'User is in the team'
    });
    res.render('createTeam', {
      errors,
      name,
      members: separatedEmails
    });
  } else {
    separatedEmails.forEach(function(separatedEmail, index, err) {
      console.log(separatedEmail)
      Student.findOne({
        email: separatedEmail
      }, function(err, student) {
        console.log(student.teamName);

        if (student.teamName != null) {
          console.log("ulazi  u deo gde treba da se zabrani da ")
          errors.push({
            msg: 'User is in the team'
          });
          console.log(errors);

          if (index === separatedEmails.length - 1) {
            console.log(index)
                console.log(errors.length);
                res.render('createTeam', {
                    errors,
                    name,
                    members: separatedEmails
                  });

              }
        } else {

          console.log("dodaje clanove")
          members.push(student._id);
          numberOfMembers++;
          console.log(members)
        }


      }).catch(err => console.log(err));
    });

    console.log(errors);


    Team.findOne({
      name: name
    }, function(err, team) {
      if (team) {
        errors.push({
          msg: 'Team exists.'
        });
        res.render('createTeam', {
          errors,
          name,
          members: separatedEmails
        });
      } else {
        const newTeam = new Team({
          errors,
          name: name,
          numberOfMembers: numberOfMembers,
          chosenTheme: chosenTheme,
          members: members,
          isApplied: isApplied
        });
        // chosenTheme = name;
        console.log("tim koji je napravljen za dodavanje ako tim uopste ne postoji" + newTeam)
        newTeam.save();
        req.flash('success_msg', 'Sucessefully created ');

        console.log("iskreirani tim je " + newTeam);


        Student.findOneAndUpdate({
          email: req.user.email
        }, {
          $set: {
            teamName: name
          }
        }).then(std => function() {});

        separatedEmails.forEach(function(separatedEmail, err) {
          Student.findOneAndUpdate({
            email: separatedEmail
          }, {
            $set: {
              teamName: name
            }
          }).then(std => function() {});
        });

        res.redirect('/team/team');

      }
    });
  }
});

router.get('/:name?', ensureAuthenticated, (req, res) => {

    Team.findOne({ name: req.params.name }, function(err, team) {

      Student.find({ teamName: team.name }, function(err, students) {

        res.render('team', {
              user: req.user,
              team: team,
              students: students
        });

      });

    });

});

module.exports = router;
