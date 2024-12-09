const mysql = require('mysql2/promise'); // Use `mysql2` for Promise-based queries

const db = mysql.createPool({
    host: process.env.server,
    user:process.env.db_username,
    database:process.env.db_name,
    password:process.env.db_password,
    port:process.env.db_port
});

module.exports=db;