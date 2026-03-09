const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkRemoteTables() {
    const url = process.argv[2] || process.env.DATABASE_URL;
    if (!url) {
        console.error('DATABASE_URL is required');
        process.exit(1);
    }

    try {
        const connection = await mysql.createConnection(url);
        console.log('Connected to:', url.split('@')[1]); // Show host for confirmation

        const [rows] = await connection.query('SHOW TABLES');
        console.log('Tables in database:');
        console.log(rows);

        const [dbRow] = await connection.query('SELECT DATABASE() as db');
        console.log('Current database:', dbRow[0].db);

        await connection.end();
    } catch (err) {
        console.error('Error:', err.message);
    }
}

checkRemoteTables();
