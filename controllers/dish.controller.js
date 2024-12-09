const db = require('../db');
const { body,param, validationResult } = require('express-validator'); // Optional for better validation
// Utility function to handle database queries
const executeQuery = async (query, params) => {
    try {
        const [results] = await db.execute(query, params);
        return results;
    } catch (error) {
        throw new Error(error.message);
    }
};

async function getAllDish(req, res){
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
}

async function saveDish(req, res){
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

async function deleteDish(req, res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.params;
    const deleteQuery = `DELETE FROM ordered_dishes_tbl WHERE did = ?`;

    try {
        const result = await executeQuery(deleteQuery, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Dish not found' });
        }

        res.json({ status: 200, result: 'Dish deleted successfully' });
    } catch (error) {
        console.error('Error executing query:', error.message);
        res.status(500).json({ error: 'Error deleting dish' });
    }
}

async function editDish(req, res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        dishName,
        preHeat,
        duration,
        prefrence,
        ovenSharing,
        notes,
    } = req.body;

    const { id } = req.params;
    const editQuery = `
        UPDATE ordered_dishes_tbl 
        SET dish_name = ?, pre_heat = ?, duration = ?, order_prefrence = ?, oven_sharing = ?, notes = ? 
        WHERE did = ?
    `;

    try {
        const result = await executeQuery(editQuery, [dishName, preHeat, duration, prefrence, ovenSharing, notes, id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Dish not found' });
        }

        // Optionally, fetch the updated record to return
        const updatedDishQuery = `SELECT * FROM ordered_dishes_tbl WHERE did = ?`;
        const updatedDish = await executeQuery(updatedDishQuery, [id]);

        res.json({ status: 200, result: 'Dish updated successfully', updatedDish });
    } catch (error) {
        console.error('Error executing query:', error.message);
        res.status(500).json({ error: 'Error updating dish' });
    }
}

module.exports={
    getAllDish,
    saveDish,
    deleteDish,
    editDish
}