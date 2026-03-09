const mysql = require('mysql2/promise');
require('dotenv').config();

// Using reliable Wikimedia/Wikipedia CDN image URLs for each dish
const imageMap = {
    'Idli': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Idli_sambar.jpg/640px-Idli_sambar.jpg',
    'Vada': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Medu_vada.jpg/640px-Medu_vada.jpg',
    'Sambar': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Sambar_rice.jpg/640px-Sambar_rice.jpg',
    'Poha': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Batata_Poha.jpg/640px-Batata_Poha.jpg',
    'Sheera': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Sooji_Halwa.jpg/640px-Sooji_Halwa.jpg',
    'Upma': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Upma.jpg/640px-Upma.jpg',
    'Aloo Bonda': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Alu_bonda.jpg/640px-Alu_bonda.jpg',
    'Puri': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Puri_sabzi.jpg/640px-Puri_sabzi.jpg',
    'Veg Thali (Chapati + 2 Curries + Rice + Papad)': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Thali_(1).jpg/640px-Thali_(1).jpg',
    'Rice': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Kannadiga_Oota.jpg/640px-Kannadiga_Oota.jpg',
    'Extra Chapati': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Chapati_Kerala.jpg/640px-Chapati_Kerala.jpg',
    'Vada Pav': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Vada_Pav_in_Mumbai.jpg/640px-Vada_Pav_in_Mumbai.jpg',
    'Bhaji (Plate)': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Pakora.jpg/640px-Pakora.jpg',
    'Khara': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Batata_Poha.jpg/640px-Batata_Poha.jpg',
    'Cutlet': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Vegetable-Cutlet.jpg/640px-Vegetable-Cutlet.jpg',
    'Patties': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Vegetable-Cutlet.jpg/640px-Vegetable-Cutlet.jpg',
};

async function fixImages() {
    const url = process.argv[2];
    if (!url) {
        console.error('Usage: node fix_images_cdn.js "mysql://..."');
        process.exit(1);
    }

    const conn = await mysql.createConnection(url);
    console.log('Connected!');

    let updated = 0;
    for (const [name, imgUrl] of Object.entries(imageMap)) {
        const [result] = await conn.query(
            'UPDATE menu_items SET image_url = ? WHERE english_name = ?',
            [imgUrl, name]
        );
        if (result.affectedRows > 0) {
            console.log(`✅ "${name}"`);
            updated++;
        } else {
            console.log(`⚠️  Not found: "${name}"`);
        }
    }

    console.log(`\nDone! Updated ${updated} items.`);
    await conn.end();
}

fixImages().catch(console.error);
