'use strict';

const express = require('express');
const cors = require('cors');
// const morgan = require('morgan');
const notFoundHandler = require('./error-handlers/404.js');
const errorHandler = require('./error-handlers/500.js');
const authRoutes = require('./auth/routes');

//require our routes

const courseRoute = require('./routes/courseRoute');
const assignmentRout = require('./routes/assignmentRout');
const quizRoute = require('./routes/quizRoute');


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authRoutes);

// proof of life

app.get('/', (req, res) => {
res.send('hello!!');
});

// use our routes

app.use('/course', courseRoute);
app.use('/assignment', assignmentRout);
app.use('/quiz', quizRoute);



// use middlewares

app.use('*',notFoundHandler);
app.use(errorHandler);

module.exports = {
    server: app,
    start: port => {
      if (!port) { throw new Error("Missing Port"); }
      app.listen(port, () => console.log(`Listening on ${port}`));
    },
  };