const mysql = require('mysql2/promise');
require('dotenv').config();

// Map menu items to the images we actually have
const imageMap = {
    'Idli': '/images/idli.jpeg',
    'Vada': '/images/vada.jpg',
    'Sambar': '/images/sambar.jpg',
    'Poha': '/images/poha.jpg',
    'Sheera': '/images/idli.jpeg',         // reuse similar
    'Upma': '/images/poha.jpg',            // reuse similar
    'Aloo Bonda': '/images/vada.jpg',      // reuse similar
    'Puri': '/images/idli.jpeg',           // reuse similar
    'Veg Thali (Chapati + 2 Curries + Rice + Papad)': '/images/veg_thali.jpg',
    'Rice': '/images/veg_thali.jpg',       // reuse similar
    'Extra Chapati': '/images/idli.jpeg',  // reuse similar
    'Vada Pav': '/images/vada_pav.jpg',
    'Bhaji (Plate)': '/images/vada.jpg',   // reuse similar
    'Khara': '/images/poha.jpg',           // reuse similar
    'Cutlet': '/images/vada_pav.jpg',      // reuse similar
    'Patties': '/images/vada_pav.jpg',     // reuse similar
};

async function fixImages() {
    const url = process.argv[2];
    if (!url) {
        console.error('Usage: node fix_images.js "mysql://..."');
        process.exit(1);
    }

    const conn = await mysql.createConnection(url);
    console.log('Connected!');

    for (const [name, imgUrl] of Object.entries(imageMap)) {
        const [result] = await conn.query(
            'UPDATE menu_items SET image_url = ? WHERE english_name = ?',
            [imgUrl, name]
        );
        console.log(`Updated "${name}" -> ${imgUrl} (${result.affectedRows} rows)`);
    }

    console.log('\nAll image URLs updated!');
    await conn.end();
}

fixImages().catch(console.error);
