'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
let secret =(process.env.SECRET||'ibrahim');
const users = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, required: true, default : 'Not Specify' },
  birthDate: { type: Date, required: true, default: '1997-01-01' },
  userCourses : {type : Object , required: false },
  role: { type: String, required: true, default: 'user', enum: ['user','admin'] },
});
// }, { toObject: { getters: true } }); // What would this do if we use this instead of just });

// Adds a virtual field to the schema. We can see it, but it never persists
// So, on every user object ... this.token is now readable!
users.virtual('token').get(function () {
  let tokenObject = {
    email:this.email,
    firstName:this.firstName,
    lastName:this.lastName
  }
  return jwt.sign(tokenObject, secret)
});

users.virtual('capabilities').get(function () {
  let acl = {
    user: ['read'],
    admin: ['read', 'create', 'update', 'delete']
  };
  return acl[this.role];
});

users.pre('save', async function () {
  try{
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }catch(e){
    console.log(e.message);
    throw new Error(e.message);
  }
});

// BASIC AUTH
users.statics.authenticateBasic = async function (username, password) {
  try{
    const user = await this.findOne({ username })
    const valid = await bcrypt.compare(password, user.password)
    if (valid) { return user; }
    throw new Error('Invalid User');
  }catch(e){
    throw new Error(e.message);
  }
}

// BEARER AUTH
users.statics.authenticateWithToken = async function (token) {
  try {
    const parsedToken = jwt.verify(token, secret);
    const user = this.findOne({ username: parsedToken.username })
    if (user) { return user; }
    throw new Error("User Not Found");
  } catch (e) {
    throw new Error(e.message)
  }
}


module.exports = mongoose.model('users', users);