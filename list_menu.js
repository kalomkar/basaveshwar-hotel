const pool = require('./database/db');

async function listMenu() {
    try {
        const [items] = await pool.query('SELECT english_name, category FROM menu_items ORDER BY category, english_name');
        console.log('Current Menu Items:');
        console.table(items);
    } catch (error) {
        console.error('Error listing menu:', error.message);
    } finally {
        process.exit();
    }
}

listMenu();
