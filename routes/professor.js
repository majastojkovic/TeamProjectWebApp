const express = require('express');
const router = express.Router();
const { ensureAuthenticatedProfessor } = require('../config/auth');
const { ensureAuthenticated } = require('../config/auth');
const Student = require('../models/Student.js');
const Professor = require('../models/Professor.js');
const Theme = require('../models/Theme.js');
const Team = require('../models/Team.js');
//const datepicker = require('js-datepicker');


// Professor Dashboard
router.get('/professorHome', ensureAuthenticatedProfessor , (req, res) => {
    Theme.find(function(err, themes) {
      Professor.find(function(err, professors){
      res.render('professordashboard', {
            professor: req.user,
            professors: professors,
            themes: themes
        });
      });
    });
});

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
    res.render('createTheme', {
      errors,
      title,
      description,
      expiryDate,
      professor:req.user,
      user: req.user
    });
  }
//provera da li tema sa datim naslovom vec postoji
Theme.findOne( {title: title} )
  .then(theme => {
    if (theme) {
      // User exists
      errors.push({
        msg: 'Theme with the specified title already exists. Please choose different one.'
      });
      res.render('createTheme', {
        errors,
        title,
        description,
        expiryDate,
        user: req.user,
        professor:req.user
      });
    } else {
//ne postoji, kreira se nova

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

      newTheme
        .save()
        .catch(err => console.log(err));
//nakon kreiranja teme, novu temu dodati u listi tema kod profesora
    Professor.findOne({_id: req.user._id})
    .then(prof => {
      if(prof)
      {
        Theme.findOne({ title: newTheme.title }, function(err, theme1)
        {
        prof.listOfThemes.push(theme1._id);
        //console.log(prof.listOfThemes);
        Professor.findOneAndUpdate( { _id : prof._id }, { $set: {listOfThemes: prof.listOfThemes } }, function(err, prof) { });
      });
      }
    });
    res.redirect('/professor/professorHome');
  }
  });


});

router.post('/search', ensureAuthenticated , (req, res) => {
    const wantedItem = req.body.searchText;
    const filterBy = req.body.searchBy;

console.log(filterBy);
if(filterBy== null || wantedItem == "")
{
  let errors = [];
    if(req.user.role=="professor")
    {
      errors.push({
        msg: 'Please check all filds for search.'
      });
      Theme.find(function(err, themes) {
        Professor.find(function(err, professors){
        res.render('professordashboard', {
              errors,
              professor: req.user,
              professors: professors,
              themes: themes
          });
        });
      });
    }else{
      errors.push({
        msg: 'Please check all filds for search.'
      });
        Theme.find(function(err, themes) {
      Professor.find(function(err, professors){
        Team.findOne({ name: req.user.teamName }, function(err, team) {
          res.render('studentdashboard', {
            errors,
            student: req.user,
            themes: themes,
            team: team,
            professors: professors
          });
        });
      });
    });
    }
}
else
{
    if(filterBy.includes("title"))
    {
      let filteredThemes =[];
    Theme.find(function(err, themes) {
        console.log(wantedItem);
          themes.forEach(function(theme){
            if(theme.title.includes(wantedItem))
             {
               filteredThemes.push(theme);
             }
          });
        });

        if(req.user.role=="professor")
        {
          Professor.find(function(err, professors){

            if (filteredThemes.length == 0) {
              console.log("Tema ne postoji");
              let errors = [];
              errors.push({ msg: "Selected theme doesn't exists." });

              Theme.find(function(err, themes) {
                res.render('professordashboard', {
                      errors,
                      professor: req.user,
                      themes: themes,
                      professors: professors

                  });
              });


            } else {
              res.render('professordashboard', {
                  professor: req.user,
                  professors: professors,
                  themes: filteredThemes
              });
            }

          });

        } else {

          Professor.find(function(err, professors){
          Team.findOne({ name: req.user.teamName }, function(err, team) {

            if (filteredThemes.length == 0) {
              console.log("Tema ne postoji");
              let errors = [];
              errors.push({ msg: "Selected theme doesn't exists." });


              Theme.find(function(err, themes) {
                res.render('studentdashboard', {
                      errors,
                      student: req.user,
                      themes: themes,
                      professors: professors

                  });
              });

            }
            else {
              console.log("Tema postoji");
              res.render('studentdashboard', {
                    student: req.user,
                    themes: filteredThemes,
                    team: team,
                    professors:professors
                });
            }


          });
        });

        }
    }
    else if(filterBy.includes("professor"))
    {
        // console.log(wantedItem);
        let filteredThemesProf =[];
        Professor.findOne({ name: wantedItem }, function(err, professor) {
          if(professor){
          console.log(professor.listOfThemes);
            Theme.find(function(err, themes) {
                professor.listOfThemes.forEach(function (profTheme){
                  var tema = themes.filter(function(theme) {
                      return theme._id.equals(profTheme);
                    })[0];
                      filteredThemesProf.push(tema);
                    console.log(tema);
                });

            });
            if(req.user.role=="professor")
            {
            Professor.find(function(err, professors){
                   res.render('professordashboard', {
                       professor: req.user,
                       professors: professors,
                       themes: filteredThemesProf
                   });
                 });
            }
            else{
                 Professor.find(function(err, professors){
              Team.findOne({ name: req.user.teamName }, function(err, team) {
              res.render('studentdashboard', {
                    student: req.user,
                    themes: filteredThemesProf,
                    team: team,
                    professors: professors
                });
              });
            });
            }
          }
          else{
            let errors = [];
              if(req.user.role=="professor")
              {
                errors.push({
                  msg: "Selected professor doesn't exists."
                });
                Theme.find(function(err, themes) {
                  Professor.find(function(err, professors){
                  res.render('professordashboard', {
                        errors,
                        professor: req.user,
                        professors: professors,
                        themes: themes
                    });
                  });
                });
              }else{
                errors.push({
                  msg: "Selected professor doesn't exists."
                });
                  Theme.find(function(err, themes) {
                Professor.find(function(err, professors){
             Team.findOne({ name: req.user.teamName }, function(err, team) {
             res.render('studentdashboard', {
                   errors,
                   student: req.user,
                   themes: themes,
                   team: team,
                   professors: professors
                  });
                  });
                });
              });
              }
          }
        });



    }
  }


});

router.post('/approveTheme',ensureAuthenticatedProfessor, (req, res, next) => {

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


//route to professorProfile.ejs
router.get('/professorProfile',ensureAuthenticatedProfessor, (req, res) => {

    Theme.find( { professor: req.user._id}, function(err, themes) {
      //console.log(themes)

      let listOfRequestsThemes = [];
      themes.forEach(function(theme){
        if(theme.isAvailable == true){
          if(theme.teamsApplied != 0){
            listOfRequestsThemes.push(theme);
          }
        }
      });
      res.render('professorProfile', {
            professor: req.user,
            themes: themes,
            listOfRequestsThemes: listOfRequestsThemes
        });

    });
});


router.post('/deleteTheme/:title?' , ensureAuthenticated, (req, res) =>{
   console.log(req.body.button)
  Theme.deleteOne({ title: req.body.button},
    function(err){}
  );
  res.redirect('/professor/professorProfile');
});

module.exports = router;
