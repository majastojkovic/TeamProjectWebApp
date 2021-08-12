// jshint esversion:6

  const express = require('express');
  const bodyParser = require('body-parser');
  const ejs = require('ejs');
  const mongoose = require('mongoose');

  const app = express();

  app.use(express.static("public"));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.set('view engine', 'ejs');

  //TODO

  app.listen(3000, function() {
    console.log("Server started on port 3000");
  });
