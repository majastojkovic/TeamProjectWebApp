const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load User model
const Professor = require('../models/Professor');
const Student = require('../models/Student');


module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
    Student.findOne({ email: email })
        .then(student => {
          if (!student) {
            Professor.findOne({ email: email})
              .then(prof => {
                if (!prof)
                {
                    return done(null, false, { message: 'That email is not registered.' });
                }
                else
                {
                  //profesor je
                  // Match password
                    bcrypt.compare(password, prof.password, (err, isMatch) => {
                      if (err)
                        throw err;
                      if (isMatch) {
                        return done(null, prof);
                      } else {
                        return done(null, false, { message: 'Password incorrect.' });
                      }
                  });

                    passport.serializeUser(function(prof, done) {
                      done(null, prof._id);
                    });

                    passport.deserializeUser(function(id, done) {
                      Professor.findById(id, function(err, prof) {
                        done(err, prof);
                      });
                    });
                }
              });
          }
          else
          {
            //student je
            // Match password
              bcrypt.compare(password, student.password, (err, isMatch) => {
                if (err)
                  throw err;
                if (isMatch) {
                  return done(null, student);
                } else {
                  return done(null, false, { message: 'Password incorrect.' });
                }
            });

              passport.serializeUser(function(student, done) {
                done(null, student._id);
              });

              passport.deserializeUser(function(id, done) {
                Student.findById(id, function(err, student) {
                  done(err, student);
                });
              });
          }
      });
    }));
};
