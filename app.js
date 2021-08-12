// jshint esversion:6

  const express = require('express');
  const bodyParser = require('body-parser');
  const ejs = require('ejs');
  const mongoose = require('mongoose');

  const app = express();

  app.use(express.static("public"));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.set('view engine', 'ejs');

  //Load models
  const Student = require('./models/Student.js');

  app.listen(3000, function() {
    console.log("Server started on port 3000");
  });

  // DB Config
  const db = require('./config/keys').mongoURI;

  // Connect to MongoDB
  mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));


const student1 = new Student({
  indexNumber:1,
  name:"Ana",
  surname:"Peric",
  email:"anaperic@gmail.com",
  password:"anaperic",
  role:"student"
});

student1.save();
