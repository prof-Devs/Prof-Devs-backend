'use strict';

const allStudents = [];

const Student = require('../models/student');

const createStudent = (id,name, password, courseId, age, level) => {
  const student = {
    id,
    name,
    password,
    courseId,
    age,
    level,
  }

  allStudents.push(student);

  let newStudent = new Student({
    studentName : name,
    studentPassword : password,
    studentAge : age,
    studentLevel : level,
  });

  newStudent.save();
  return student;
};

const getStudent = id => allStudents.find(student => student.id === id);

const removeStudent = id => {
  const index = allStudents.findIndex(student => student.id === id);
  if (index !== -1) {
    allStudents.splice(index, 1);
  }
};

module.exports = { allStudents, createStudent, getStudent, removeStudent };
