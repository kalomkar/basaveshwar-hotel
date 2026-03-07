const pool = require('../database/db');

// @route   POST api/attendance/clock-in
// @desc    Clock in for the day
// @access  Private (All staff)
exports.clockIn = async (req, res) => {
    try {
        const userId = req.user.id;
        const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const time = new Date().toLocaleTimeString('en-GB'); // HH:MM:SS

        // Check if already clocked in today
        const [existing] = await pool.query('SELECT * FROM attendance WHERE user_id = ? AND date = ?', [userId, date]);

        if (existing.length > 0) {
            return res.status(400).json({ message: 'Already clocked in for today' });
        }

        await pool.query('INSERT INTO attendance (user_id, date, check_in) VALUES (?, ?, ?)', [userId, date, time]);

        res.json({ message: 'Clocked in successfully', time });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   PUT api/attendance/clock-out
// @desc    Clock out for the day
// @access  Private (All staff)
exports.clockOut = async (req, res) => {
    try {
        const userId = req.user.id;
        const date = new Date().toISOString().split('T')[0];
        const time = new Date().toLocaleTimeString('en-GB');

        const [existing] = await pool.query('SELECT * FROM attendance WHERE user_id = ? AND date = ?', [userId, date]);

        if (existing.length === 0) {
            return res.status(400).json({ message: 'Not clocked in today' });
        }

        if (existing[0].check_out) {
            return res.status(400).json({ message: 'Already clocked out' });
        }

        await pool.query('UPDATE attendance SET check_out = ? WHERE user_id = ? AND date = ?', [time, userId, date]);

        res.json({ message: 'Clocked out successfully', time });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET api/attendance/reports
// @desc    Get attendance reports
// @access  Private (Manager)
exports.getReports = async (req, res) => {
    try {
        const [reports] = await pool.query(`
            SELECT a.*, u.username, u.role 
            FROM attendance a 
            JOIN users u ON a.user_id = u.id 
            ORDER BY a.date DESC
        `);
        res.json(reports);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
