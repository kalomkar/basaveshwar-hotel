const pool = require('./database/db');

async function cleanupDuplicates() {
    try {
        console.log('Starting menu item cleanup...');

        // Find duplicates
        const [duplicates] = await pool.query(`
            SELECT english_name, category, COUNT(*) as count 
            FROM menu_items 
            GROUP BY english_name, category 
            HAVING count > 1
        `);

        if (duplicates.length === 0) {
            console.log('No duplicate menu items found.');
            process.exit();
        }

        console.log(`Found ${duplicates.length} duplicate item names.`);

        for (const duplicate of duplicates) {
            console.log(`Cleaning up: ${duplicate.english_name} (${duplicate.count} entries)`);

            // Delete all except the one with the minimum ID
            const [deleteResult] = await pool.query(`
                DELETE m1 FROM menu_items m1
                INNER JOIN menu_items m2 
                WHERE 
                    m1.id > m2.id AND 
                    m1.english_name = ? AND 
                    m1.category = ?
            `, [duplicate.english_name, duplicate.category]);

            console.log(`Removed ${deleteResult.affectedRows} duplicate copies of ${duplicate.english_name}.`);
        }

        console.log('Cleanup complete!');
    } catch (error) {
        console.error('Error during cleanup:', error.message);
    } finally {
        process.exit();
    }
}

cleanupDuplicates();
