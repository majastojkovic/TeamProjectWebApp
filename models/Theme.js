const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const themeSchema = new Schema({
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
    type: Schema.ObjectId,
    ref: "Professor", 
    require: true
  },

  expiryDate: {
    type: Date,
    require: true

  },

  teamsApplied: [{
    type: Schema.ObjectId,
    ref: "Team"
  }],

  teamApproved: {
    type: Schema.ObjectId,
    ref: "Team"
  }

});

const Theme = mongoose.model('Theme', themeSchema);

module.exports = Theme;
