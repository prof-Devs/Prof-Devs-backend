'use strict';

const users = require('../models/users.js')
const teacherUsers = require('../models/teacher.js')
const admins = require('../models/admin')
// const gettingTeachers = require('../routes')

const func1 = async (req, res, next) => {
 
  try {
    // console.log(req.body);
 
    if (!req.headers.authorization) { _authError() }

    const token = req.headers.authorization.split(' ').pop();
    const validUser = await users.authenticateWithToken(token);

    req.user = validUser;
    req.token = validUser.token;
    next();

  } catch (e) {
    _authError();
  }

  function _authError() {
    next('Access Denied');
  }
}

// for teacher!!!

const func2 = async (req, res, next) => {
  // console.log('gggg',req);
  // console.log('req.headers.authorization',req.headers.authorization);

  try {

    if (!req.headers.authorization) { _authError() }
  
    const token = req.headers.authorization.split(' ').pop();
    const validUser = await teacherUsers.authenticateWithToken(token);
    // const testing = await gettingTeachers.authRouter0;
    // const decoding = 
    // testing.map
   
    req.user = validUser;
    req.token = validUser.token;
    next();

  } catch (e) {
    _authError();
  }

  function _authError() {
    next('Access Denied');
  }
}

const func3 = async (req, res, next) => {
  // console.log('gggg',req);
  // console.log('req.headers.authorization',req.headers.authorization);

  try {

    if (!req.headers.authorization) { _authError() }
  
    const token = req.headers.authorization.split(' ').pop();
    const validUser = await admins.authenticateWithToken(token);
    // const testing = await gettingTeachers.authRouter0;
    // const decoding = 
    // testing.map
   
    req.user = validUser;
    req.token = validUser.token;
    next();

  } catch (e) {
    _authError();
  }

  function _authError() {
    next('Access Denied');
  }
}
module.exports = { func1, func2 ,func3}