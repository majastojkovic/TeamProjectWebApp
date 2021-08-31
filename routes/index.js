const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Theme = require('../models/Theme.js');
const Professor = require('../models/Professor.js');

//Welcome Page
router.get('/', (req, res) => res.render('login'));

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

router.post('/search', ensureAuthenticated , (req, res) => {
    const wantedItem = req.body.searchText;
    const filterBy = req.body.searchBy;

console.log(filterBy);
    if(filterBy.includes("title"))
    {
      let filteredThemes =[];
    Theme.find(function(err, themes) {
        console.log(wantedItem);

          themes.forEach(function(theme){
            if(theme.title.includes(wantedItem))//&&theme.expiryDate >= Date.now() && theme.isAvailable == true)
             {
               filteredThemes.push(theme);
             }
          });
        });
        if(req.user.role=="professor")
        {
          console.log(filteredThemes);
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
          Team.findOne({ name: req.user.teamName }, function(err, team) {
          res.render('studentdashboard', {
                student: req.user,
                themes: filteredThemes,
                team: team
            });
          });
        }
    }
    else if(filterBy.includes("professor"))
    {
        console.log(wantedItem);
        let filteredThemesProf =[];
        Professor.findOne({ name: wantedItem }, function(err, professor) {
          console.log(professor.listOfThemes);
            Theme.find(function(err, themes) {
                professor.listOfThemes.forEach(function (profTheme){
                  console.log(profTheme);
                  themes.forEach(function(theme){
                    if(profTheme.equals(theme._id))
                    {

                    }
                  });
                  var tema = themes.filter(function(theme) {
                      return theme._id.equals(profTheme);
                    })[0];
                      filteredThemesProf.push(tema);
                    console.log(tema);
                });
          //  if(theme.expiryDate >= Date.now() && theme.isAvailable == true)
          //  {
            //}

            });
            if(req.user.role=="professor")
            {
            console.log(filteredThemesProf);
            Professor.find(function(err, professors){
                   res.render('professordashboard', {
                       professor: req.user,
                       professors: professors,
                       themes: filteredThemesProf
                   });
                 });
            }
            else{
              Team.findOne({ name: req.user.teamName }, function(err, team) {
              res.render('studentdashboard', {
                    student: req.user,
                    themes: filteredThemes,
                    team: team
                });
              });

            }
        });


    }
    else
    {
        alert("Please select filter.");
    }

});


module.exports = router;
