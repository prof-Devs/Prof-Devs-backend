'use strict';

const express = require('express');
const cors = require('cors');
const notFoundHandler = require('./error-handlers/404.js');
const errorHandler = require('./error-handlers/500.js');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
res.send('hello!!');
});


app.use('*',notFoundHandler);
app.use(errorHandler);

module.exports = {
    server: app,
    start: port => {
      if (!port) { throw new Error("Missing Port"); }
      app.listen(port, () => console.log(`Listening on ${port}`));
    },
  };