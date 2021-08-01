'use strict';
const mongoose = require('mongoose');

const assignment = new mongoose.Schema({
  title:{type: String, required: true, unique: true},
  text:{type: String, required: true},
  due_date:{type: Date ,required: true},
//   assignmentFile:{type: Object},
  solution:{type: Object,required:false},
  studentsName: { type: Object,required:false }
});

module.exports = mongoose.model('assignment', assignment);