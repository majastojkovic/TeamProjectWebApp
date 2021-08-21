const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const {
  ensureAuthenticated
} = require('../config/auth');

const Team = require('../models/Team.js');
const Student = require('../models/Student.js');
const router = express.Router();


router.get('/team', ensureAuthenticated, (req, res) => {
    Team.findOne( { name: req.user.teamName}, function(err, team) {
      Student.find({ teamName : team.name}, function(err,students){

      res.render('team', {
            user: req.user,
            team: team,
            students :students
        });
      });
});
});

router.post('/createTeam', (req, res, err) => {
  const emails = req.body.members;
  const name = req.body.name;
  //console.log(name)
  var members = [];
  var i = 0;
  let errors = [];
  const isApplied = false;
  const numberOfMembers = 0;
  const chosenTheme = null;

  let separatedEmails = "";
  separatedEmails = emails.split(',');
  console.log(separatedEmails);

separatedEmails.forEach(function(separatedEmail){
  console.log(separatedEmail)
  Student.findOne({ email:separatedEmail  }).then(student => {
      if (student.teamName != "") {
        Team.findOne({ name: name }).then(team =>{
          console.log("tim koji je pronadjen"+team)
          if(!team){
          //console.log("nema takvog tima treba da se kreira")
              //  console.log(student._id)
                 members.push(student._id);
                 const newTeam = new Team({
                 errors,
                 name: name,
                 numberOfMembers: numberOfMembers,
                 chosenTheme: chosenTheme,
                 members: members,
                 isApplied: isApplied
               });
               console.log("tim koji je napravljen za dodavanje ako tim uopste ne postoji"+newTeam)
               newTeam.save();
               console.log("iskreirani tim je " +newTeam);

            }
          else{
            console.log(student + "ovde treba da se doda student ako tim vec postoji i ima mesta")
                const numberOfMem = members.length;
                for(var i = 0; i<= numberOfMem; i++){
                  if(members[i] === student._id && numberOfMem >4 && numberOfMem <2){
                    console.log("ne moze da se doda student")
                  }
                }
         }


        }).catch(err => console.log(err));
    }
    }).catch(err => console.log(err));
    res.redirect('/team/team');


});

});


module.exports = router;
