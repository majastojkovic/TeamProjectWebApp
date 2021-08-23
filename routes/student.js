const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

const Student =require('../models/Student.js');
const Team = require('../models/Team.js');
// Professor Dashboard
router.get('/studentHome', ensureAuthenticated, (req, res) => res.render('studentdashboard'));

router.get('/createTeam', ensureAuthenticated, (req, res) => res.render('createTeam'));


//route to team.ejs
/*router.get('/team', (req, res) => res.render('team', {
  team:req.user
}));*/
/*router.get('/team/:name?', ensureAuthenticated, (req, res) => {
    Team.findOne({ name: req.params.name }, function(err, team) {
      res.render('team', {
            user: req.user,
            team: team
        });
    });
});*/
module.exports = router;
