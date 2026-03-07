const pool = require('../database/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user exists
        const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        if (users.length === 0) {
            console.warn(`[Login] Attempt failed: User '${username}' not found.`);
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const user = users[0];

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.warn(`[Login] Attempt failed: Password mismatch for user '${username}'.`);
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        console.log(`[Login] Successful: ${username} (${user.role})`);

        // Create JWT Payload
        const payload = {
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        };

        // Sign Token
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '12h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, role: user.role, id: user.id, username: user.username });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getMe = async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id, username, role FROM users WHERE id = ?', [req.user.id]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(users[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
