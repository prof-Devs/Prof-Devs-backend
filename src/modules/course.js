'use strict';

const allCourses = [];
const Course = require ('../models/student');

const createCourse = (id,name ) => {
  const courseKey = (length = 8) => {
    return Math.random().toString(10).substr(2, length);
  };
  const mycourse = {
    id = courseKey,
    name,
  };

  allCourses.push (mycourse);

  let newCourse= new Course({
    courseName : name,
  });

  newCourse.save();
  return mycourse;
};

const getCourse = (id) => allCourses.find ((course) => course.id === id );

const updateCourse = (mycourse) => {
  const index = allCourses.findIndex ((course) => course.id === mycourse.id );
  if (index !== -1){
    allCourses[index] = mycourse;
  }
};

module.exports = {allCourses, createCourse, getCourse, updateCourse};

