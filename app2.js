const express = require('express');
const app = express();
const mysql = require('mysql2/promise'); // Use `mysql2` for Promise-based queries
const { body, validationResult } = require('express-validator'); // Optional for better validation
const jwt = require('jsonwebtoken');
const secretKey = 'Express@0000'; // 
// Create a connection pool to improve performance and manage multiple connections
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'chef_db',
    port: 8889,
});

// Middleware to parse JSON requests
app.use(express.json());

// Utility function to handle database queries
const executeQuery = async (query, params) => {
    try {
        const [results] = await db.execute(query, params);
        return results;
    } catch (error) {
        throw new Error(error.message);
    }
};

app.post('/login', (req, res) => {
    
    if(req.body.username){
        const { username } = req.body;
        
        // Simple example, replace this with actual user authentication logic
        if ( username!='naveen') {
            return res.status(400).json({ error: 'Username is not valid' });
        }

        // Generate a token
        const token = jwt.sign({ username }, secretKey, { expiresIn: '24h' });
        res.json({ token });
    }else{
        res.json({status:400,error:"username not found"})
    }
    
});

// Middleware to verify JWT
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, secretKey, (err, user) => {
            if (err) {
                return res.status(403).json({ error: 'Invalid token' });
            }
            req.user = user; // Attach user information to the request
            next();
        });
    } else {
        res.status(401).json({ error: 'Authorization token is missing' });
    }
};

//

// Route to get all dishes
app.get('/getDish', authenticateJWT,async (req, res) => {
    const { batch } = req.body;

    if (!batch) {
        return res.status(400).json({ error: "Batch number is required for open orders" });
    }

    const query = `
        SELECT * 
        FROM ordered_dishes_tbl 
        JOIN serve_order_tbl 
        ON ordered_dishes_tbl.batch = serve_order_tbl.batch
        WHERE ordered_dishes_tbl.batch = ?
    `;

    try {
        const results = await executeQuery(query, [batch]);
        res.json({ results });
    } catch (error) {
        console.error('Error executing query:', error.message);
        res.status(500).json({ error: 'Error executing query' });
    }
});



// Route to save a dish
app.post(
    '/saveDish',
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
    authenticateJWT,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            batch,
            serveTime,
            desc,
            dishName,
            preHeat,
            duration,
            prefrence,
            ovenSharing,
            notes,
        } = req.body;

        // 

        const insertServeOrderQuery = `
            INSERT INTO serve_order_tbl (serve_time, batch, dish_description) 
            VALUES (?, ?, ?)
        `;
        const insertDishQuery = `
            INSERT INTO ordered_dishes_tbl (batch, dish_name, pre_heat, duration, order_prefrence, oven_sharing, notes) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        try {
            await executeQuery(insertServeOrderQuery, [serveTime, batch, desc]);
            await executeQuery(insertDishQuery, [batch, dishName, preHeat, duration, prefrence, ovenSharing, notes]);

            res.json({ status: 200, result: 'Data saved successfully' });
        } catch (error) {
            console.error('Error executing queries:', error.message);
            res.status(500).json({ error: 'Error saving data' });
        }
    }
);


// edit serve time api
app.post('/deleteDish/:id', authenticateJWT,async (req, res) => {
    console.log(req.params.id);
});
module.exports = app;
