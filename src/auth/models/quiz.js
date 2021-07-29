'use strict';

const mongoose = require('mongoose');

const quiz = new mongoose.Schema({
  title:{type: String, required: true, unique: true},
  questions:{type: Array, required: true}, //array of objects [{question:'', options:[], correct-answer:''},{}]
  timer:{type: Number ,required: true},
  quizFile:{type: Buffer},
  solution:{type:Array}, //[{student:email , answers:{} , time:11}]
  students: { type: Array }
});

module.exports = mongoose.model('quiz', quiz);