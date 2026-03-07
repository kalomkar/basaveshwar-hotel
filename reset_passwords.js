const bcrypt = require('bcryptjs');
const pool = require('./database/db');

async function resetPassword() {
    const newPassword = 'password123';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    console.log('New hash for password123:', hash);

    try {
        const [result] = await pool.query('UPDATE users SET password = ? WHERE username = ?', [hash, 'manager']);
        console.log('Manager password updated:', result.affectedRows > 0 ? 'Success' : 'Failed');

        // Also update cashier and waiters for consistency
        await pool.query('UPDATE users SET password = ? WHERE role IN ("cashier", "waiter")', [hash]);
        console.log('All other staff passwords updated to password123');

    } catch (err) {
        console.error('Error updating password:', err.message);
    }
    process.exit();
}

resetPassword();
