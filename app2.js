const express = require('express');
const app = express();
require('dotenv').config();
const { body,param, validationResult } = require('express-validator'); // Optional for better validation

const loginController = require('./controllers/login.controller');
const dishRouter = require('./routes/dish.route');

// Middleware to parse JSON requests
app.use(express.json());
// Middleware to verify JWT
const authenticateJWT = loginController.jwtfn

app.post('/login',loginController.login);
// dish router
app.use('/',authenticateJWT,dishRouter)
module.exports = app;
