'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const http = require('http');
const app = express();
const http = require ('http');
const io = require ('socket.io')(http);
const server = http.createServer(app);

const courseRoom = 'course';
const {allCourses, createCourse, getCourse, updateCourse }= require ('../modules/course');

app.use(cors());

io.on('connection', (socket) => {

  socket.on('join', (payload) => {
    const student = {studentName: payload.name, id : socket.id};
    socket.to(courseRoom).emit('onlineStudents', student);
  });
  socket.on('createCourse', (payload)=>{
    const courseKey = `Course${courseKey}`;
    const course = createCourse(courseKey ,payload.name);
    socket.join(courseKey);
    socket.emit('updateCourse', {course}); 
  });
  socket.on('joinCourse',(payload) => {
    const course = getCourse(payload.courseId);
    if(!course){
      return 'Incorrect Id';
    };

    socket.join(payload.courseId);
    socket.emit('updateCourse', {course});

    socket.to(payload.courseId).emit ('claimed',{name : payload.name});
  });

  
})