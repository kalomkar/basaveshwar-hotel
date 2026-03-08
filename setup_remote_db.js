const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupRemoteDb() {
    const url = process.argv[2] || process.env.DATABASE_URL;

    if (!url) {
        console.error('Error: Please provide your Railway DATABASE_URL as an argument.');
        console.log('Usage: node setup_remote_db.js "mysql://user:pass@host:port/db"');
        process.exit(1);
    }

    console.log('Connecting to remote database...');

    let connection;
    try {
        connection = await mysql.createConnection(url);
        console.log('Connected successfully!');

        const schemaPath = path.join(__dirname, 'database', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Split by semicolon but ignore semicolons inside quotes or comments if possible
        // For simplicity, we split by common SQL delimiters
        const queries = schema
            .split(/;\s*$/m)
            .map(q => q.trim())
            .filter(q => q.length > 0);

        console.log(`Executing ${queries.length} queries...`);

        for (let i = 0; i < queries.length; i++) {
            try {
                await connection.query(queries[i]);
                process.stdout.write('.');
            } catch (err) {
                console.error(`\nError in query ${i + 1}:`, err.message);
            }
        }

        console.log('\nDatabase schema imported successfully!');
    } catch (error) {
        console.error('Failed to setup database:', error.message);
    } finally {
        if (connection) await connection.end();
    }
}

setupRemoteDb();
