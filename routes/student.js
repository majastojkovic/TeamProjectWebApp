const express = require('express');
const router = express.Router();
const { ensureAuthenticatedStudent } = require('../config/auth');
const { ensureAuthenticated } = require('../config/auth');
// Professor Dashboard
router.get('/studentHome', ensureAuthenticatedStudent, (req, res) => res.render('studentdashboard'));

module.exports = router;
