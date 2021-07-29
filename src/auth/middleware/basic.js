'use strict';

const base64 = require('base-64');
const User = require('../models/users.js');
const User2 = require('../models/teacher.js');

const fun1 =async (req, res, next) => {
  if (!req.headers.authorization) { return _authError(); }

  let basic = req.headers.authorization.split(' ').pop();
  let [user, pass] = base64.decode(basic).split(':');

  try {
    req.user = await User.authenticateBasic(user, pass)
    next();
  } catch (e) {
    _authError()
  }

  function _authError() {
    res.status(403).send('Invalid Login');
  }

}


const fun2 =async (req, res, next) => {

  if (!req.headers.authorization) { return _authError(); }

  let basic = req.headers.authorization.split(' ').pop();
  let [user, pass] = base64.decode(basic).split(':');

  try {
    req.user = await User2.authenticateBasic(user, pass)
    next();
  } catch (e) {
    _authError()
  }

  function _authError() {
    res.status(403).send('Invalid Login');
  }

}

module.exports = {fun1,fun2}