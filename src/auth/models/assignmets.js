'use strict';
const mongoose = require('mongoose');

let assignment = new mongoose.Schema({
  title:{type: String, required: true},
  text:{type: String, required: true},
  due_date:{type: Date ,required: true},
//   assignmentFile:{type: Object},
  solution:{type: Array,required:false},// [{email:'email',solution:'solution'}]
  // studentsName: { type: Object,required:false }
  courseId:{type: String,required: true}
});

module.exports = mongoose.model('assignment', assignment);