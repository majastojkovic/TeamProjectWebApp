const mongoose = require('mongoose');

const themeSchema = new mongoose.Schema({
//title je unique
  title:{
    type: String,
    require: true
  },

  description: {
    type: String,
    require: true
  },

  isAvailable:{
    type: Boolean,
    require: true
  },

  professor: {
    type: professorSchema,
    require: true
  },

  expiryDate: {
    type: Date,
    require: true

  },

  teamsApplied: [teamSchema],

  teamApproved: teamSchema

});

const Theme = mongoose.model('Theme', themeSchema);

module.exports = Theme;
