'use strict';

const mongoose = require('mongoose');
const functionModel = require('./functions')

const students = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, required: true, default : 'Not Specify' },
  age: { type: String, required: true},
  userCourses : {type : Object , required: false },
  role:{type:String, required: true, default: 'user', enum: 'user'}
});

students.virtual('token').get(functionModel.forVirtual);

students.virtual('capabilities').get(functionModel.forVirtual2);

students.pre('save',functionModel.forPre);

// BASIC AUTH
students.statics.authenticateBasic = functionModel.forBasic;

// BEARER AUTH
students.statics.authenticateWithToken = functionModel.forBearer;

module.exports = mongoose.model('students', students);