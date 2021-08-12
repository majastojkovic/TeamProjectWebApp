const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
//name je unique
  name: {
    type: String,
    require: true
  },

  numberOfMembers:{
    type: Number,
    require: true
  },

  chosenTheme: themeSchema,

  members: [studentSchema],

//sprecava da tim aplicira vise puta na temu
  isApplied: {
    type: Boolean
  }

});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
