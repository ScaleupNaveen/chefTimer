const express = require('express');
const app = express();
const mysql = require('mysql');

// Create a connection to the database
const db = mysql.createConnection({
    host: 'localhost', 
    user: 'root',      
    password: 'root',      
    database: 'chef_db',
    port:8889
});

// Connect to MySQL
db.connect((err) => {
if (err) {
    console.error('Error connecting to the database:', err.message);
    return;
}
console.log('Connected to the MySQL database.');
});
  


//const dishRoute = require('./routes/dish.route');


// Middleware to parse JSON requests
app.use(express.json());

// get all the dish
app.get('/getDish',(req,res)=>{
    if(!req.body.batch){
        var batch = req.body.batch;
        var query = "select * from ordered_dishes_tbl,serve_order_tbl where ordered_dishes_tbl.batch=serve_order_tbl.batch";
        db.query(query, (err, results) => {
            if (err) {
              console.error('Error executing query:', err);
              res.status(500).send('Error executing query');
              return;
            }

            res.send({results});
        });
    }else{
        res.status(400).json({error:"Need Batch Number For Open Order"});
    }
});

// api for dish
app.post('/saveDish',(req,res)=>{
    if (req.body.batch && req.body.serveTime && req.body.desc && req.body.dishName && 
        req.body.preHeat && req.body.duration && req.body.prefrence && req.body.ovenSharing && req.body.notes){
        const batch = req.body.batch;
        const serveTime = req.body.serveTime;
        const desc = req.body.desc;
        const dishName = req.body.dishName;
        const preHeat = req.body.preHeat;
        const duration = req.body.duration;
        const prefrence = req.body.prefrence;
        const ovenSharing = req.body.ovenSharing;
        const notes = req.body.notes;

        // insert into db 
        var query1 = `insert into serve_order_tbl(serve_time,batch,dish_description) values('${serveTime}','${batch}','${desc}')`;
        db.query(query1, (err, results) => {
            if (err) {
              console.error('Error executing query:', err);
              res.status(500).send('Error executing query');
              return;
            }
        });

        var query2 = `insert into ordered_dishes_tbl(batch,dish_name,pre_heat,duration,order_prefrence,oven_sharing,notes) values('${batch}','${dishName}','${preHeat}','${duration}','${prefrence}','${ovenSharing}','${notes}')`;
        db.query(query2, (err, results) => {
            if (err) {
              console.error('Error executing query:', err);
              res.status(500).send('Error executing query');
              return;
            }
        });

        res.json({status:200,result:'data saved'})
    }else{
        console.log(req.body)
        res.status(400).json({
            error:"params is missing"
        });
    }
});


module.exports = app;
