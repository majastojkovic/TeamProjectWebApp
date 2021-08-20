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

router.post('/search', ensureAuthenticatedProfessor , (req, res) => {
    const wantedItem = req.body.searchText;
    let filteredThemes =[];
    let flag= false;
    Theme.find(function(err, themes) {
        console.log(wantedItem);
        console.log(themes);
          themes.forEach(function(theme){
            if(theme.title.includes(wantedItem))
             {
               filteredThemes.push(theme);
               flag=true;
             }
          });
        });
        if(flag){
          Professor.find(function(err, professors){
            res.render('professordashboard', {
                professor: req.user,
                professors: professors,
                themes: filteredThemes
            });
          });
        }
        else
        {
          Theme.find(function(err, themes) {
            Professor.find(function(err, professors){
              themes.forEach(function(theme) {
         	      professors.forEach(function (prof) {
                  if(prof.name === wantedItem) {
                    filteredThemes.push(theme);
         	        }
                  console.log(filteredThemes);
                });
              });
              res.render('professordashboard', {
                professor: req.user,
                professors: professors,
                themes: filteredThemes
              });

            });
          });

        }
        flag=false;
});


module.exports = router;
