'use strict';
const mongoose = require('mongoose');

const assignment = new mongoose.Schema({
  title:{type: String, required: true, unique: true},
  text:{type: String, required: true},
  due_date:{type: String ,required: true},
//   assignmentFile:{type: Object},
  solution:{type: Array,required:false},// [{email:'email',solution:'solution'}]
  // studentsName: { type: Object,required:false }
});

module.exports = mongoose.model('assignment', assignment);