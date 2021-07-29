'use strict';

const allStudents = [];

// const Student = require('../models/student');

const createStudent = (id, name, courseRoom) => {
  const student = {
    id,
    name,
    courseRoom,
  }

  allStudents.push(student);

  // let newStudent = new Student({
  //   studentName : name,
  //   studentPassword : password,
  //   studentAge : age,
  //   studentLevel : level,
  // });

  // newStudent.save();
  return { student };
};

const getStudent = id => allStudents.find(student => student.id === id);

const removeStudent = id => {
  const index = allStudents.findIndex(student => student.id === id);
  if (index !== -1) {
    allStudents.splice(index, 1)[0];
  }
};

const getStudntsInCourse = (courseRoom) => allStudents.filter((student) => student.courseRoom === courseRoom);


module.exports = { allStudents, createStudent, getStudent, removeStudent, getStudntsInCourse };
