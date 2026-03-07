const pool = require('../database/db');

// @desc    Get all menu items
// @route   GET /api/menu
// @access  Public
exports.getMenuItems = async (req, res) => {
    try {
        const [items] = await pool.query('SELECT * FROM menu_items');
        res.json(items);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Add a new menu item
// @route   POST /api/menu
// @access  Private (Manager)
exports.addMenuItem = async (req, res) => {
    try {
        const { category, english_name, hindi_name, kannada_name, price, image_url } = req.body;

        const [result] = await pool.query(
            'INSERT INTO menu_items (category, english_name, hindi_name, kannada_name, price, image_url) VALUES (?, ?, ?, ?, ?, ?)',
            [category, english_name, hindi_name, kannada_name, price, image_url]
        );

        res.json({ id: result.insertId, category, english_name, hindi_name, kannada_name, price, image_url, is_available: 1 });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update a menu item
// @route   PUT /api/menu/:id
// @access  Private (Manager)
exports.updateMenuItem = async (req, res) => {
    try {
        const { category, english_name, hindi_name, kannada_name, price, image_url, is_available } = req.body;

        await pool.query(
            'UPDATE menu_items SET category = ?, english_name = ?, hindi_name = ?, kannada_name = ?, price = ?, image_url = ?, is_available = ? WHERE id = ?',
            [category, english_name, hindi_name, kannada_name, price, image_url, is_available, req.params.id]
        );

        res.json({ message: 'Menu item updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Toggle item availability (Mark Out of Stock)
// @route   PATCH /api/menu/:id/availability
// @access  Private (Manager)
exports.toggleAvailability = async (req, res) => {
    try {
        const { is_available } = req.body;

        await pool.query('UPDATE menu_items SET is_available = ? WHERE id = ?', [is_available, req.params.id]);

        res.json({ message: 'Availability updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
