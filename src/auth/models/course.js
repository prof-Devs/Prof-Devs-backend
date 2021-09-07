'use strict';

const mongoose = require('mongoose');


const course = new mongoose.Schema({
    courseName: { type: String, required: true },
    courseDisc: { type: String, required: true },
    courseStudents: { type: Array, required: true},
    marks: { type: Array, required: false },
    courseTeacher: { type: String, required: true },
    firstTeacherName: { type: String, required: true },
    lastTeacherName: { type: String, required: true },
})

module.exports = mongoose.model('course', course)
