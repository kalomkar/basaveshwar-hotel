const pool = require('./database/db');

async function fixDatabase() {
    try {
        console.log('Fixing database duplicates and applying constraints...');

        // 1. Correct cleanup of duplicates
        const [cleanupResult] = await pool.query(`
            DELETE m1 FROM menu_items m1
            INNER JOIN menu_items m2 ON m1.english_name = m2.english_name AND m1.category = m2.category
            WHERE m1.id > m2.id
        `);
        console.log(`Cleaned up ${cleanupResult.affectedRows} duplicate records.`);

        // 2. Apply UNIQUE constraint to live DB
        try {
            await pool.query('ALTER TABLE menu_items ADD UNIQUE INDEX idx_unique_menu (english_name, category)');
            console.log('✅ Unique index applied to menu_items table.');
        } catch (e) {
            if (e.code === 'ER_DUP_ENTRY') {
                console.error('❌ Could not apply unique index: Duplicate entries found even after cleanup. Manual check required.');
            } else if (e.code === 'ER_DUP_KEYNAME') {
                console.log('ℹ️ Unique index already exists.');
            } else {
                console.error('Error applying index:', e.message);
            }
        }

    } catch (error) {
        console.error('Error during fix:', error.message);
    } finally {
        process.exit();
    }
}

fixDatabase();
