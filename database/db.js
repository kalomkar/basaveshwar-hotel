const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool(process.env.DATABASE_URL ? {
    uri: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
} : {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'basaveshwar_hotel',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : null
});

module.exports = pool;
