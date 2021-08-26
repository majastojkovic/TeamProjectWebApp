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


module.exports = router;
