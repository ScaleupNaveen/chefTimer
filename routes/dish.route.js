const express = require('express');
const dishRouter = express.Router();

const dishController = require('../controllers/dish.controller');

// routues
dishRouter.get('/',dishController.getAllDish);

module.exports=dishRouter