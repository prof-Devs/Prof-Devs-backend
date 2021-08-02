'use strict';

const express = require('express');
const cors = require('cors');
// const morgan = require('morgan');
require('dotenv').config();
const http = require('http');
const app = express();
const socketio = require ('socket.io');
// const io = require('socket.io')(http);
// const server = http.createServer(app);
const User = require('./auth/models/users');

const server = http.createServer(app);
const io = socketio(server, 
  {cors:
    {origin: 'http://localhost:3000',
    credentials: true,  }
});


const notFoundHandler = require('./error-handlers/404.js');
const errorHandler = require('./error-handlers/500.js');
const authRoutes = require('./auth/routes');

//require our routes

const courseRoute = require('./routes/courseRoute');
const assignmentRout = require('./routes/assignmentRout');
const quizRoute = require('./routes/quizRoute');


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authRoutes);


io.on('connection', socket => {
  socket.on('message', ({ name, message }) => {
    console.log('hello hoooo');
    io.emit('message', { name, message })
  })
})


// io.on('connection', (socket) => {

//   socket.on('signup', (payload) => {
//     const data = {
//       email: payload.studentEmail,
//       password: payload.password,
//       firstName: payload.firstName,
//       lastName: payload.lastName,
//       gender: payload.gender,
//       age: payload.age,
//     }
//     console.log(payload)
//     let user = new User(data);
//     user.save();
    // const output = {
    //   user: userRecord,
    //   token: userRecord.token

    // };
//   }
//   )


//   socket.on('join', ({ name, courseRoom }, callback) => {

//     const { error, student } = createStudent({ id: socket.id, name, courseRoom });

//     if (error) return callback(error);

//     socket.join(student.courseRoom);

//     socket.emit('message', { student: 'admin', text: `${student.name}, Welcome to course ${student.courseRoom}` });
//     socket.broadcast.to(student.courseRoom).emit('message', { student: 'admin', text: `${student.name} has joined!` });

//     io.to(student.courseRoom).emit('roomData', { room: student.courseRoom, students: getStudntsInCourse(student.courseRoom) });

//     callback();
//   });

//   socket.on('sendMessage', (message, callback) => {
//     const student = getStudent(socket.id);

//     io.to(student.courseRoom).emit('message', { student: student.name, text: message });

//     callback();
//   });

//   socket.on('disconnect', () => {
//     const student = removeStudent(socket.id);


//     if (student) {
//       io.to(student.courseRoom).emit('message', { student: 'admin', text: `${student.name} has left.` })
//       io.to(student.courseRoom).emit('roomData', { room: student.courseRoom, students: getStudntsInCourse(student.courseRoom) });
//     }
//   });
// });



// proof of life
app.get('/', (req, res) => {
  res.send('hello!!');
});

// use our routes
app.use('/course', courseRoute);
app.use('/assignment', assignmentRout);
app.use('/quiz', quizRoute);



// use middlewares

app.use('*', notFoundHandler);
app.use(errorHandler);


module.exports = {
  // server: app,
  start: port => {
    if (!port) { throw new Error("Missing Port"); }
    server.listen(port, () => console.log(`Listening on ${port}`));
  },
};