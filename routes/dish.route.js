const express = require('express');
const dishRouter = express.Router();
const { body,param, validationResult } = require('express-validator'); // Optional for better validation
const dishController = require('../controllers/dish.controller');

// routues
// Route to get all dishes
dishRouter.get('/getDish', dishController.getAllDish);

// Route to save a dish
dishRouter.post('/saveDish',
    [
        body('batch').notEmpty().withMessage('Batch is required'),
        body('serveTime').notEmpty().withMessage('Serve time is required'),
        body('desc').notEmpty().withMessage('Description is required'),
        body('dishName').notEmpty().withMessage('Dish name is required'),
        body('preHeat').notEmpty().withMessage('Preheat is required'),
        body('duration').notEmpty().withMessage('Duration is required'),
        body('prefrence').notEmpty().withMessage('Preference is required'),
        body('ovenSharing').notEmpty().withMessage('Oven sharing is required'),
        body('notes').notEmpty().withMessage('Notes are required'),
    ],
    dishController.saveDish
);
// Route to delete a dish
dishRouter.post('/deleteDish/:id',
    [param('id').isInt().withMessage('ID must be an integer')],
    
    dishController.deleteDish
);

// Edit dish
dishRouter.post('/editDish/:id',
    [
        param('id').isInt().withMessage('ID must be an integer'),
        body('dishName').notEmpty().withMessage('Dish name is required'),
        body('preHeat').notEmpty().withMessage('Preheat value is required'),
        body('duration').notEmpty().withMessage('Duration is required'),
        body('prefrence').notEmpty().withMessage('Preference is required'),
        body('ovenSharing').notEmpty().withMessage('Oven sharing value is required'),
        body('notes').notEmpty().withMessage('Notes are required'),
    ],
    
    dishController.editDish
);

module.exports=dishRouter