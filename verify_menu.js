const pool = require('./database/db');

async function verifyMenu() {
    try {
        console.log('Verifying menu items...');
        const [duplicates] = await pool.query(`
            SELECT english_name, category, COUNT(*) as count 
            FROM menu_items 
            GROUP BY english_name, category 
            HAVING count > 1
        `);

        if (duplicates.length === 0) {
            console.log('✅ PASS: No duplicate menu items found.');
        } else {
            console.log('❌ FAIL: Found duplicates:');
            console.table(duplicates);
        }

        const [rowCount] = await pool.query('SELECT COUNT(*) as total FROM menu_items');
        console.log(`Total menu items: ${rowCount[0].total}`);

    } catch (error) {
        console.error('Verification error:', error.message);
    } finally {
        process.exit();
    }
}

verifyMenu();
