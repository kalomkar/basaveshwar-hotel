const db = require('./database/db');

async function updateIdliImage() {
    try {
        await db.query("UPDATE menu_items SET image_url = '/images/idli.jpeg' WHERE english_name = 'Idli'");
        console.log('Successfully updated the live database image path to idli.jpeg!');
    } catch (error) {
        console.log('Database probably not setup yet, skipping live update. Schema updated instead!');
    }
    process.exit();
}

updateIdliImage();
