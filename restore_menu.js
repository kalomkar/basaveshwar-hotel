const pool = require('./database/db');

async function restoreMenu() {
    try {
        console.log('Restoring default menu items...');

        const items = [
            // Breakfast
            ['Breakfast', 'Idli', 'इडली', 'ಇಡ್ಲಿ', 35.00, '/images/idli.jpeg'],
            ['Breakfast', 'Vada', 'वडा', 'ವಡೆ', 35.00, '/images/vada.jpg'],
            ['Breakfast', 'Sambar', 'सांभर', 'ಸಾಂಬಾರ್', 35.00, '/images/sambar.jpg'],
            ['Breakfast', 'Poha', 'पोहा', 'ಪೊಹಾ', 35.00, '/images/poha.jpg'],
            ['Breakfast', 'Sheera', 'शीरा', 'ಶೀರಾ', 35.00, '/images/sheera.jpg'],
            ['Breakfast', 'Upma', 'उपमा', 'ಉಪ್ಮಾ', 35.00, '/images/upma.jpg'],
            ['Breakfast', 'Aloo Bonda', 'आलू बोंडा', 'ಆಲೂ ಬೊಂಡಾ', 35.00, '/images/aloo_bonda.jpg'],
            ['Breakfast', 'Puri', 'पूरी', 'ಪೂರಿ', 35.00, '/images/puri.jpg'],

            // Lunch/Dinner
            ['Lunch/Dinner', 'Veg Thali (Chapati + 2 Curries + Rice + Papad)', 'वेज थाली', 'ವೆಜ್ ಥಾಳಿ', 70.00, '/images/veg_thali.jpg'],
            ['Lunch/Dinner', 'Rice', 'चावल', 'ಅನ್ನ', 40.00, '/images/rice.jpg'],
            ['Lunch/Dinner', 'Extra Chapati', 'अतिरिक्त चपाती', 'ಹೆಚ್ಚುವರಿ ಚಪಾತಿ', 10.00, '/images/extra_chapati.jpg'],

            // Snacks
            ['Snacks', 'Vada Pav', 'वड़ा पाव', 'ವಡಾ ಪಾವ್', 25.00, '/images/vada_pav.jpg'],
            ['Snacks', 'Bhaji (Plate)', 'भाजी', 'ಭಾಜಿ', 25.00, '/images/bhaji.jpg'],
            ['Snacks', 'Khara', 'खारा', 'ಖಾರಾ', 30.00, '/images/khara.jpg'],
            ['Snacks', 'Cutlet', 'कटಲೆಟ್', 'ಕಟ್ಲೆಟ್', 15.00, '/images/cutlet.jpg'],
            ['Snacks', 'Patties', 'पैटीज़', 'ಪ್ಯಾಟೀಸ್', 15.00, '/images/patties.jpg']
        ];

        for (const item of items) {
            await pool.query(
                'INSERT IGNORE INTO menu_items (category, english_name, hindi_name, kannada_name, price, image_url) VALUES (?, ?, ?, ?, ?, ?)',
                item
            );
        }

        console.log('✅ Menu restoration complete.');

    } catch (error) {
        console.error('Error during restoration:', error.message);
    } finally {
        process.exit();
    }
}

restoreMenu();
