require('dotenv').config();
const express = require('express');
const registerRouter = require('./routes/register.js');
const loginRouter = require('./routes/login.js');


const dotenv = require('dotenv');

// -- The utilities the application uses --
const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.use(logger);

// -- Routers --

app.use('/register', registerRouter);

app.use('/login', loginRouter);

app.get('/', (req, res) => {
  console.log('App is running..');
});

// -- Middleware that tracks the actions in the application --
function logger(req, res, next) {
  console.log('The current URL path is: ' + req.originalUrl);
  next();
}

module.exports = app;