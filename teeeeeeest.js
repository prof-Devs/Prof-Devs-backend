'use strict';

const express = require('express');
const courseRouter = express.Router();
const bearerAuth = require('../middleware/bearer.js');
const getCourseData = require('../middleware/getCourseData.js');
const permission = require('../middleware/permission.js');
const mongooseCourse = require('../model/cours-model.js');
const mongooseAssignment = require('../model/assignment-model.js')
const mongooseQuiz = require('../model/quiz-model.js');
const User = require('../model/users-model');

courseRouter.post('/course/:courseID/create-assignment', bearerAuth, getCourseData, permission, async (req, res) => {
  const thisCourse = req.course;
  const assignmet = new mongooseAssignment(req.body);
  console.log(assignmet);
  thisCourse.assignments.push(assignmet);
  const myCourse = await mongooseCourse.findByIdAndUpdate(thisCourse._id, thisCourse, { new: true });
  await myCourse.save()
  res.send(myCourse.assignments);
});

courseRouter.post('/course/:courseID/create-quiz', bearerAuth, getCourseData, permission, async (req, res) => {
  const thisCourse = req.course;
  const quiz = new mongooseQuiz(req.body);
  thisCourse.quizes.push(quiz);
  const myCourse = await mongooseCourse.findByIdAndUpdate(thisCourse._id, thisCourse, { new: true });

  res.send(myCourse.quizes);
});



courseRouter.get('/course/:courseID/grades', bearerAuth, getCourseData, permission, (req, res) => {

  // let courseID = req.params.courseID;
  // console.log('------------hi------------', req.course);
  res.status(200).json(req.course.grades)


});

courseRouter.get('/course/:courseID', bearerAuth, getCourseData, async (req, res) => {
  let a = await mongooseCourse.findById(req.params.courseID)
  res.status(200).json(a)
})
courseRouter.post('/course/:courseID/grades', bearerAuth, getCourseData, permission, async (req, res) => {

  try {
    const id = req.params.courseID;
    const email = req.body.email;
    const myCourse = await mongooseCourse.findById(id);
    if (myCourse) {
      if (!myCourse.members.includes(email)) next('you are not enrolled in this course')
      let newGrades = myCourse.grades.map(element => {
        if (element.email == email) {
          element = { ...element, ...req.body };
          console.log('in post grade', element);
        }
        return element;
      });
      console.log('in post grade', newGrades);
      myCourse.grades = newGrades;
      await mongooseCourse.findByIdAndUpdate(myCourse._id, myCourse, { new: true });
      res.status(201).json(myCourse);
    } else {
      next('course not found')
    }
  } catch (err) {
    res.status(401).json(err)
  }
});

courseRouter.delete('/course/:courseID/delete', bearerAuth, getCourseData, permission, async (req, res) => {
  const id = req.params.courseID;
  const theCourse = await mongooseCourse.findById(id)
  const theUsers = theCourse.members;
  for (let courseUser of theUsers) {
    const theUser = await User.findOne({ email: courseUser })
    const myCourses = theUser.userCourses;
    let index = 0
    for (let ele of myCourses) {
      if (ele.id == id) myCourses.splice(index, 1);
      index++
    }
    await theUser.save();
  }
  const deleted = await mongooseCourse.findByIdAndDelete(id)
  res.status(201).json(deleted)
})

courseRouter.post('/create-course', bearerAuth, async (req, res) => {
  req.body.owner = req.user.email
  req.body.members = [];
  const email = req.user.email;
  req.body.members.push(email)
  let course = new mongooseCourse(req.body);
  const newCourse = await course.save();
  let id = course._id
  let a = await User.findOne({ email })
  // console.log('-------------------------', id);
  let courseObject = {
    name: course.name,
    description: course.description,
    owner: course.owner,
    id: course._id
  }
  console.log('-------------------------', courseObject);
  let b = a.userCourses.push(courseObject);
  await a.save()
  res.status(201).json(newCourse);

});




courseRouter.get('/my-courses', bearerAuth, async (req, res, next) => {
  res.status(200).json(req.user.userCourses)
})

courseRouter.post('/join-course', bearerAuth, async (req, res, next) => {
  let id = req.body.id;
  const email = req.user.email;
  const myCourse = await mongooseCourse.findById(id);
  if (myCourse) {
    if (myCourse.members.includes(email)) next('you are already enrolled')
    let obj = {
      email: email,
      midExam: 0,
      firstExam: 0,
      secondExam: 0,
      quizOne: 0,
      quizTwo: 0,
      quizThree: 0,
      finalExam: 0,
      overAll: 0
    }
    myCourse.members.push(email);
    myCourse.grades.push(obj);
    let courseObject = {
      name: myCourse.name,
      description: myCourse.description,
      owner: myCourse.owner,
      id: myCourse._id
    }
    console.log('-------------------------', courseObject);
    let a = await User.findOne({ email })
    let b = a.userCourses.push(courseObject);
    await a.save()
    // await User.save();
    await myCourse.save()
    res.status(201).json(myCourse);

  } else {
    next('course not found')
  }
});

courseRouter.post('/course/:courseID/:assignmentID/submit-assignment', bearerAuth, getCourseData, async (req, res) => {
  const thisUser = req.user;
  const thisCourse = req.course;
  const assignmentSolution = req.body;

  const assID = req.params.assignmentID;

  const solutionInfo = {
    student: thisUser.email,
    solution: assignmentSolution
  }

  const index = thisCourse.assignments.findIndex(x => x._id == assID);
  thisCourse.assignments[index].solutionInfo.push(solutionInfo);
  thisCourse.assignments[index].students.push(solutionInfo.student);
  const myCourse = await mongooseCourse.findByIdAndUpdate(thisCourse._id, thisCourse, { new: true });
  res.send(myCourse.assignments);
});
courseRouter.delete('/course/:courseID/delete-as/:assignmentID', bearerAuth, getCourseData, permission, async (req, res) => {
  const id = req.params.courseID;
  const theCourse = await mongooseCourse.findById(id)
  console.log('--------theCourse--------', theCourse);
  const asID = req.params.assignmentID;
  const myAssign = theCourse.assignments;
  console.log('--------myAssign--------', myAssign);
  // const index = myAssign.indexOf(asID)
  for (let index = 0; index < myAssign.length; index++) {
    const element = myAssign[index];
    if (element._id == asID) {
      myAssign.splice(index, 1);
    }
  }
  console.log('--------myAssign after--------', myAssign);

  await theCourse.save();
  res.send(myAssign);

})
courseRouter.delete('/course/:courseID/delete-qu/:quizID', bearerAuth, getCourseData, permission, async (req, res) => {
  const id = req.params.courseID;
  const theCourse = await mongooseCourse.findById(id)
  const quID = req.params.quizID;
  const myQuizez = theCourse.quizes;
  // const index = myQuizez.indexOf(quID)
  for (let index = 0; index < myQuizez.length; index++) {
    const element = myQuizez[index];
    if (element._id == quID) {
      myQuizez.splice(index, 1);
    }
  }
  await theCourse.save();
  res.send(myQuizez);
})

courseRouter.delete('/course/:courseID/delete-student', bearerAuth, getCourseData, permission, async (req, res) => {
  const id = req.params.courseID;
  const email = req.body.email;
  console.log('email', email);
  const theCourse = await mongooseCourse.findById(id)
  const myMembers = theCourse.members;
  console.log('myMembers', myMembers);
  const index = myMembers.indexOf(email)
  if (index > -1) {
    myMembers.splice(index, 1);
  }
  console.log('myMembers', myMembers);
  await theCourse.save();
  const student = await User.findOne({ email })
  const studentCourses = student.userCourses;
  console.log('studentCourses', studentCourses);
  let indexT = 0
  for (let ele of studentCourses) {
    if (ele.id == id) {
      studentCourses.splice(indexT, 1);
      break;
    }
    indexT++
  }
  console.log('studentCourses', studentCourses);
  await student.save()
  res.json(student) ;
})

courseRouter.delete('/course/:courseID/leave-course', bearerAuth, getCourseData, async (req, res) => {
  const id = req.params.courseID;
  const email = req.user.email;
  const theCourse = await mongooseCourse.findById(id)
  const myMembers = theCourse.members;
  const index = myMembers.indexOf(email)
  if (index > -1) {
    myMembers.splice(index, 1);
  }
  await theCourse.save();
  const student = await User.findOne({ email })
  const studentCourses = student.userCourses;
  let indexT = 0
  for (let ele of studentCourses) {
    if (ele.id == id) studentCourses.splice(indexT, 1);
    indexT++
  }
  await student.save()
  return theCourse;
})

courseRouter.post('/course/:courseID/:quizID/submit-quiz', bearerAuth, getCourseData, async (req, res) => {
  const thisUser = req.user;
  const thisCourse = req.course;
  const quizSolution = req.body;

  const quizID = req.params.quizID;

  const solutionInfo = {
    student: thisUser.email,
    solution: quizSolution.solution
  }

  const index = thisCourse.quizes.findIndex(x => x._id == quizID);
  console.log(thisCourse.quizes[index]);
  thisCourse.quizes[index].solutionInfo.push(solutionInfo);
  thisCourse.quizes[index].students.push(solutionInfo.student);
  const myCourse = await mongooseCourse.findByIdAndUpdate(thisCourse._id, thisCourse, { new: true });
  res.send(myCourse.quizes);
});
module.exports = courseRouter;