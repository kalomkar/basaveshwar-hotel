const db = require('./database/db');

async function updateMenu() {
    try {
        console.log('Updating menu item images...');

        // Update existing items
        await db.query("UPDATE menu_items SET image_url = '/images/idli.jpeg' WHERE english_name = 'Idli'");
        await db.query("UPDATE menu_items SET image_url = '/images/vada.jpg' WHERE english_name = 'Vada'");
        await db.query("UPDATE menu_items SET image_url = '/images/veg_thali.jpg' WHERE english_name LIKE 'Veg Thali%'");
        await db.query("UPDATE menu_items SET image_url = '/images/poha.jpg' WHERE english_name = 'Poha'");
        await db.query("UPDATE menu_items SET image_url = '/images/vada_pav.jpg' WHERE english_name = 'Vada Pav'");

        // Add "New Banana" item (interpreted as Banana Leaf Special)
        await db.query(`INSERT IGNORE INTO menu_items (category, english_name, hindi_name, kannada_name, price, image_url) 
                       VALUES ('Lunch/Dinner', 'Banana Leaf Special Thali', 'केले के पत्ते की विशेष थाली', 'ಬಾಳೆ ಎಲೆ ವಿಶೇಷ ಥಾಲಿ', 120.00, '/images/veg_thali.jpg')`);

        console.log('✅ Menu updated successfully!');
    } catch (error) {
        console.error('❌ Error updating menu:', error);
    }
    process.exit();
}

updateMenu();
