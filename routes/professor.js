const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

// Professor Dashboard
router.get('/professorHome', ensureAuthenticated, (req, res) => res.render('professordashboard'));

//route to professorProfile.ejs
//router.get('/', ensureAuthenticated, (req, res) => res.render(''))
module.exports = router;
