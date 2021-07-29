'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const http = require('http');
const app = express();
const io = require ('socket.io')(http);
const server = http.createServer(app);

const courseRoom = 'course';
const { createStudent, getStudent, removeStudent, getStudntsInCourse } = require ('../modules/student');

app.use(cors());

io.on('connect', (socket) => {

  socket.on('join' , ({ name, courseRoom}, callback) =>{
 
    const { error , student } = createStudent({ id: socket.id, name, courseRoom});

    if(error) return callback(error);

    socket.join(student.courseRoom);

    socket.emit('message', { student: 'admin', text: `${student.name}, Welcome to course ${student.courseRoom}`});
    socket.broadcast.to(student.courseRoom).emit('message', { student: 'admin', text: `${student.name} has joined!`});

    io.to(student.courseRoom).emit('roomData', { room: student.courseRoom, students: getStudntsInCourse(student.courseRoom)});

    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const student = getStudent(socket.id);

    io.to(student.courseRoom).emit('message', {student: student.name, text: message});

    callback();
  });

  socket.on('disconnect', () => {
      const student = removeStudent(socket.id);


      if(student){
        io.to(student.courseRoom).emit('message', { student: 'admin', text: `${student.name} has left.`})
        io.to(student.courseRoom).emit('roomData', { room: student.courseRoom, students: getStudntsInCourse(student.courseRoom)});
      }
  });
});


// io.on('connect', (socket) => {

//   socket.on('join', (payload) => {
//     const student = {studentName: payload.name, id : socket.id};
//     socket.to(courseRoom).emit('onlineStudents', student);
//   });
  
//   socket.on('createCourse', (payload)=>{
//     const courseKey = `Course${courseKey}`;
//     const course = createCourse(courseKey ,payload.name);
//     socket.join(courseKey);
//     socket.emit('updateCourse', {course}); 
//   });

//   socket.on('joinCourse',(payload) => {
//     const student = {studentName: payload.name, id : socket.id};
//     socket.to(courseRoom).emit('onlineStudents', student);

//     const course = getCourse(payload.courseId);
//     if(!course){
//       return 'Incorrect Id';
//     };

//     socket.join(payload.courseId);
//     socket.emit('updateCourse', {course});

//     socket.to(payload.courseId).emit ('claimed',{name : payload.name});


//   });

  
