const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

const Professor = require('../models/Professor.js');
const Theme = require('../models/Theme.js');

// Professor Dashboard
router.get('/professorHome', ensureAuthenticated, (req, res) => {
    Theme.find(function(err, themes) { res.render('professordashboard', {
            professor: req.user,
            themes: themes
        });
    });
});

//route to professorProfile.ejs
router.get('/professorProfile', ensureAuthenticated, (req, res) => {

    Theme.find( { professor: req.user._id}, function(err, themes) {
      //console.log(themes)

      let listOfRequestsThemes = [];
      themes.forEach(function(theme){
        if(theme.teamsApplied.length > 0){
          listOfRequestsThemes.push(theme);
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
