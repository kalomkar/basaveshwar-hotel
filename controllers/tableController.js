const pool = require('../database/db');

// @route   GET api/tables
// @desc    Get all tables and their statuses
// @access  Private (Waiter, Cashier, Manager)
exports.getTables = async (req, res) => {
    try {
        const [tables] = await pool.query('SELECT * FROM tables');
        res.json(tables);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   PUT api/tables/:id
// @desc    Update a table status
// @access  Private (Waiter, Cashier, Manager)
exports.updateTableStatus = async (req, res) => {
    try {
        const { status } = req.body;

        // Validate status
        if (!['Available', 'Occupied', 'Reserved'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        await pool.query('UPDATE tables SET status = ? WHERE id = ?', [status, req.params.id]);

        res.json({ message: 'Table status updated successfully', status });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
