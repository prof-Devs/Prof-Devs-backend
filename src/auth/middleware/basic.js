'use strict';

const base64 = require('base-64');
const User = require('../models/users.js');
const User2 = require('../models/teacher.js');
const admin = require('../models/admin');

const fun1 = async (req, res, next) => {
  // console.log(req.body.role);
  if (!req.headers.authorization) { return _authError(); }

  let basic = req.headers.authorization.split(' ').pop();
  let [user, pass] = base64.decode(basic).split(':');

  try {
    // console.log('Hello again')
    req.user = await User.authenticateBasic(user, pass)
    next();
  } catch (e) {
    // res.send('Incorrect password');
    _authError()
  }

  function _authError() {
    res.status(403).send('Invalid Login');
  }
}

const fun2 = async (req, res, next) => {
  // console.log(req.body.headers.authorization);
  if (!req.headers.authorization) { return _authError(); }
// Basic hghgawewqewfe=
  let basic = req.headers.authorization.split(' ').pop();
  let [user, pass] = base64.decode(basic).split(':');

  try {
    req.user = await User2.authenticateBasic(user, pass)
    next();
  } catch (e) {
    // res.send('Incorrect password');
    _authError()
 }
  function _authError() {
    res.status(403).send('Invalid Login');
  }
}

const fun3 = async (req, res, next) => {
  // console.log(req.body.headers.authorization);
  if (!req.headers.authorization) { return _authError(); }
// Basic hghgawewqewfe=
  let basic = req.headers.authorization.split(' ').pop();
  let [user, pass] = base64.decode(basic).split(':');

  try {
    req.user = await admin.authenticateBasic(user, pass)
    next();
  } catch (e) {
    // res.send('Incorrect password');
    _authError()
  }

  function _authError() {
    res.status(403).send('Invalid Login');
  }

}

module.exports = { fun1, fun2,fun3 }