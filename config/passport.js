const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Load User model
const Professor = require('../models/Professor');
const Student = require('../models/Student');
module.exports = (app) => {

  passport.use('localStudent',
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      Student.findOne({ email: email })
        .then(user => {
          if (!user) {
            return done(null, false, { message: 'That email is not registered.' });
          }

        // Match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err)
              throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: 'Password incorrect.' });
            }
        });
      });
    })
  );



  passport.use('localProfessor',
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      Professor.findOne({ email: email })
        .then(user1 => {
          if (!user1) {
            return done(null, false, { message: 'That email is not registered.' });
          }

        // Match password
          bcrypt.compare(password, user1.password, (err, isMatch) => {
            if (err)
              throw err;
            if (isMatch) {
              return done(null, user1);
            } else {
              return done(null, false, { message: 'Password incorrect.' });
            }
        });
      });
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, { _id:user._id, role: user.role });
  });

  passport.deserializeUser((login, done) => {
          if (login.role === 'student') {
              Student.findById(login, function (err, user) {
                  if (user)
                      done(null, user);
                  else
                      done(err, { message: 'Student not found' })
              });
          }
          else if (login.role === 'professor') {
              Professor.findById(login, (err, admin) => {
                  if (admin)
                      done(null, admin);
                  else
                      done(err, { message: 'Professor not found' })
              });
          }
          else {
              done({ message: 'No entity found' }, null);
          }
      });

}
