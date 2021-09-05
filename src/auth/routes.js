'use strict';

const express = require('express');
const authRouter = express.Router();

const User = require('./models/users.js');
const Teacher = require('./models/teacher.js');
const Admin = require('./models/admin');
const basicAuth = require('./middleware/basic.js')
const bearerAuth = require('./middleware/bearer.js')
const permissions = require('./middleware/acl.js')

authRouter.post('/signup/student', async (req, res, next) => {
  try {
    // (req.headers);
    // const { age, firstName, gender, lastName, password, studentEmail } = req.body;
    // let user = new User({
    //   email: studentEmail,
    //   password: password,
    //   firstName: firstName,
    //   lastName: lastName,
    //   gender: gender,
    //   age: age,

    // });
    const userRecord = new User(req.body);
    await userRecord.save();
    // res.send('You are successfully signed up!')
    const output = {
      user: userRecord,
      token: userRecord.token
    };
    res.status(201).json(output);
  } catch (e) {
    // res.send('Email is already exist');
    next('Email is already exist')
  }
});

authRouter.post('/signup/teacher', async (req, res, next) => {
  try {

    const userRecord = new Teacher(req.body);
    await userRecord.save();
    const output = {
      user: userRecord,
      token: userRecord.token
    };
    res.status(201).json(output);
  } catch (e) {
    next('Email is already exist')
  }
});

authRouter.post('/signup/admin', async (req, res, next) => {
  try {

    const userRecord = new Admin(req.body);
    await userRecord.save();
    const output = {
      user: userRecord,
      token: userRecord.token
    };
    res.status(201).json(output);
  } catch (e) {
    next('Email is already exist')
  }
});
authRouter.post('/signin/admin', basicAuth.fun3, (req, res, next) => {
  try {
    // res.send('you are signedIn!')

     ('Hello');
      const user = {
        user: req.user,
        token: req.user.token
      };
    res.status(200).json(user);
  } catch (e) {
    res.send('Incorrect password');
    throw new Error(e.message)
  }
});
authRouter.get('/getUsers', async (req, res, next) => {
  try {
    const allUsers = [];
    const students = await User.find({});

    const teachers = await Teacher.find({});
    students.map(ele => allUsers.push(ele));
    teachers.map(ele => allUsers.push(ele));

    res.send(allUsers);
  } catch (e) {
    throw new Error(e.message)
  }
});

authRouter.get('/getTeachers', async (req, res, next) => {
  try {
    const allTeachers = [];
    const teachers = await Teacher.find({});
    teachers.map(ele => allTeachers.push({'email':ele.email,'id':ele._id}));

    res.send(allTeachers);
  } catch (e) {
    throw new Error(e.message)
  }
});


authRouter.post('/signin/user', basicAuth.fun1, (req, res, next) => {
  try {
    // res.send('you are signedIn!')

     ('Hello');
      const user = {
        user: req.user,
        token: req.user.token
      };
    res.status(200).json(user);
  } catch (e) {
    res.send('Incorrect password');
    throw new Error(e.message)
  }
});

authRouter.post('/signin/teacher', basicAuth.fun2, (req, res, next) => {
  try {
    // ('Hello');
    // res.send('you are signedIn!')
    const user = {
      user: req.user,
      token: req.user.token
    };
    res.status(200).json(user);
  } catch (e) {
    res.send('Incorrect password');
    throw new Error(e.message)
  }
  
});

authRouter.delete('/userDelete/:id', bearerAuth.func2, permissions('delete'), async (req, res, next) => {
  try {
    const id = req.params.id;
    await User.findByIdAndDelete(id);
    // const list = users.map(user => user.email);
    res.status(200).json('user was deleted');
  } catch (e) {
    throw new Error(e.message)
  }
});
authRouter.get('/showStudents', bearerAuth.func2, permissions('read'), async (req, res, next) => {
  try {

    const users = await User.find({})
    const list = users.map(user => user.email);
    res.status(200).json(list);
  } catch (e) {
    throw new Error(e.message)
  }
});
authRouter.delete('/teacherDelete/:id', bearerAuth.func3, permissions('adminDelete'), async (req, res, next) => {
  try {
   
    const id = req.params.id;
    await Teacher.findByIdAndDelete(id);
    res.status(200).json('teacher is deleted');
  } catch (e) {
    ('hiiiiiiiiiiiiiiiiiiiiiii');
    throw new Error(e.message)
  }
});

// authRouter.get('/secret', bearerAuth, async (req, res, next) => {
//   res.status(200).send('Welcome to the secret area')
// });

module.exports = authRouter;