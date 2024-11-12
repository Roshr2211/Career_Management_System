const mysql = require('mysql');
const dotenv = require('dotenv').config();


const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
// Initialize companies table
db.query(`
    CREATE TABLE IF NOT EXISTS COMPANIES (
        company_id VARCHAR(50) PRIMARY KEY,
        company_name VARCHAR(100) NOT NULL,
        industry VARCHAR(100) NOT NULL,
        company_description TEXT,
        image_path VARCHAR(255)
    )
`, (err) => {
    if (err) {
        console.error('Error creating companies table:', err);
    } else {
        console.log('Companies table checked/created successfully');
    }
});

module.exports = db;