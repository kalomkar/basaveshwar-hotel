const pool = require('./database/db');

async function debug() {
    try {
        console.log('Testing connection...');
        const [databases] = await pool.query('SHOW DATABASES LIKE "basaveshwar_hotel"');
        console.log('Databases found:', databases);

        if (databases.length === 0) {
            console.log('Database basaveshwar_hotel NOT found!');
            return;
        }

        console.log('Checking tables...');
        const [tables] = await pool.query('SHOW TABLES');
        console.log('Tables in basaveshwar_hotel:', tables);

        const tableNames = tables.map(t => Object.values(t)[0]);

        if (tableNames.includes('menu_items')) {
            const [count] = await pool.query('SELECT COUNT(*) as count FROM menu_items');
            console.log('Menu items count:', count[0].count);
            if (count[0].count > 0) {
                const [rows] = await pool.query('SELECT * FROM menu_items LIMIT 5');
                console.log('First 5 menu items:', rows);
            }
        } else {
            console.log('Table menu_items NOT found!');
        }

        if (tableNames.includes('users')) {
            const [users] = await pool.query('SELECT username, role, password FROM users');
            console.log('Users in database:', users);
        } else {
            console.log('Table users NOT found!');
        }

    } catch (err) {
        console.error('DATABASE ERROR:', err);
    } finally {
        process.exit();
    }
}

debug();
