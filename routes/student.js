const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

// Professor Dashboard
router.get('/studentHome', ensureAuthenticated, (req, res) => res.render('studentdashboard'));

module.exports = router;
