const express = require('express');
const router = express.Router();
const { ensureAuthenticatedProfessor } = require('../config/auth');
const { ensureAuthenticated } = require('../config/auth');
// Professor Dashboard
router.get('/professorHome', ensureAuthenticatedProfessor , (req, res) => res.render('professordashboard', { professor: req.user }));

router.get('/professorProfile', ensureAuthenticatedProfessor, (req, res) => res.render('professorProfile', { professor: req.user }));

//route to professorProfile.ejs
//router.get('/', ensureAuthenticated, (req, res) => res.render(''))
module.exports = router;
