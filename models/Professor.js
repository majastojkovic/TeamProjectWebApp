const mongoose = require('mongoose');

const professorSchema = new mongoose.Schema({

  id: {
    type: Number,
    require: true
  },

  name: {
    type: String,
    require: true
  },

  surname:{
    type: String,
    require: true
  },

  email: {
    type: String,
    require: true
  },

  password: {
    type: String,
    require: true
  },

  role: {
    type: String,
    require: true
  },

  listOfThemes: [themeSchema]

});

const Professor = mongoose.model('Professor', professorSchema);

module.exports = Professor;
