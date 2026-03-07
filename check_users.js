const pool = require('./database/db');

async function checkUsers() {
    try {
        const [rows] = await pool.query('SELECT username, role FROM users');
        console.log('Users in database:', rows);
    } catch (err) {
        console.error('Error querying database:', err.message);
    }
    process.exit();
}

checkUsers();
