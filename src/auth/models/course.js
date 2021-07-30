'use strict';

const mongoose = require('mongoose');

const course = new mongoose.Schema({
    courseName: { type: String, required: true },
    courseDisc: { type: String, required: true },
    courseStudents: { type: Array, required: true},
    courseAssignments: { type: Array, required: false },
    courseQuizes: { type: Array, required: false },
    marks: { type: Array, required: false },
    courseTeacher: { type: String, required: true }
})

module.exports = mongoose.model('course', course)