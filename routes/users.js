const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const mongoose = require('mongoose');

const { ensureAuthenticated } = require('../config/auth');

const Student = require('../models/Student.js');
const Professor = require('../models/Professor.js');
const router = express.Router();

//Welcome Page
//router.get('/', (req, res) => res.render('welcome'));

//Register Page
router.get('/register', (req, res) => res.render('register'));

// Login Page
router.get('/login', (req, res) => res.render('login'));

//router.get('/studentHome', ensureAuthenticated, (req, res) => res.render('studentdashboard'));

//router.get('/professorHome', ensureAuthenticated, (req, res) => res.render('professordashboard'));



// Register
router.post('/register', (req, res) => {
  const {
    name,
    surname,
    email,
    password,
    password2,
    role
  } = req.body;
  let errors = [];

  // Check reqired fields
  if (!name || !surname || !email || !password || !password2 || !role) {
    errors.push({
      msg: 'Please fill in all fields.'
    });
  }

  //Check passwords match
  if (password !== password2) {
    errors.push({
      msg: 'Passwords do not match.'
    });
  }

  // Check pass length
  if (password.length < 6) {
    errors.push({
      msg: 'Password should be at least 6 characters.'
    });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      surname,
      email,
      password,
      password2,
      role // svakako ne kreira nalog ako nije definisano ali kad se radi re-render, ne pamti izabrane vrednosti
    });
  } else {
    if (role == 'student') {
      // Vallidatio passed
      Student.findOne({
        email: email
      }).then(user => {
        if (user) {
          // User exists
          errors.push({
            msg: 'Email is already registered.'
          });
          res.render('register', {
            errors,
            name,
            surname,
            email,
            password,
            password2,
            role
          });
        } else {
          const newUser = new Student({
            errors,
            name,
            surname,
            email,
            password,
            role
          });

          // Hash Password
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              // Set password to hashed
              newUser.password = hash;
              // Save user
              newUser
                .save()
                .then(user => {
                  //  req.flash('success_msg', 'You are now registered and can log in.');
                  res.redirect('/users/login');
                })
                .catch(err => console.log(err));
            });
          });
        }
      });
    } else {
      // Vallidatio passed
      Professor.findOne({
        email: email
      }).then(user => {
        if (user) {
          // User exists
          errors.push({
            msg: 'Email is already registered.'
          });
          res.render('register', {
            errors,
            name,
            surname,
            email,
            password,
            password2,
            role
          });
        } else {
          const newUser = new Professor({
            errors,
            name,
            surname,
            email,
            password,
            role
          });

          // Hash Password
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              // Set password to hashed
              newUser.password = hash;
              // Save user
              newUser
                .save()
                .then(user => {
                  //  req.flash('success_msg', 'You are now registered and can log in.');
                  res.redirect('/users/login');
                })
                .catch(err => console.log(err));
            });
          });
        }
      });
    }

  }
});

router.post('/login', (req, res, next) => {
  Student.findOne({
    email: req.body.email
  }).then(user => {
    if (user) {
      // User exists
      // Loged User is student
      passport.authenticate('local', {
        successRedirect: '/student/studentHome',
        failureRedirect: '/users/login',
        failureFlash: true
      })(req, res, next);
    } else {
      Professor.findOne({
        email: req.body.email
      }).then(user1 => {
        if(user1){
        // Loged User is professor
        passport.authenticate('local', {
          successRedirect: '/professor/professorHome',
          failureRedirect: '/users/login',
          failureFlash: true
        })(req, res, next);
      }
      })
    }
  });

});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/');
});


module.exports = router;
