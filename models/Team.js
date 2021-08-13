const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teamSchema = new Schema({
//name je unique
  name: {
    type: String,
    require: true
  },

  numberOfMembers:{
    type: Number,
    require: true
  },

  chosenTheme: {
    type: Schema.ObjectId,
    ref: "Theme"
  },

  members: [{
    type: Schema.ObjectId,
    ref: "Student"
  }],

//sprecava da tim aplicira vise puta na temu
  isApplied: {
    type: Boolean
  }

});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
