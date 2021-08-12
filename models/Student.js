const mongoose = require('mongoose');

    const studentSchema = new mongoose.Schema({

      indexNumber: {
        type: Number,
        require: true
      },

      name: {
        type: String,
        require: true
      },

      surname: {
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

      teamName: {
        type: String
      },

      role: {
        type: String,
        require: true
      }

    });

    const Student = mongoose.model('Student', studentSchema);

    module.exports = Student;
