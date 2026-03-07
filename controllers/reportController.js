const pool = require('../database/db');

// @route   GET api/reports/dashboard
// @desc    Get dashboard summary (Today's Sales, Orders, etc.)
// @access  Private (Manager)
exports.getDashboardSummary = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        // Today's Sales
        const [salesResult] = await pool.query(
            `SELECT COALESCE(SUM(amount), 0) as todaySales 
             FROM payments 
             WHERE status = 'Success' AND DATE(timestamp) = ?`,
            [today]
        );

        // Today's Orders
        const [ordersResult] = await pool.query(
            `SELECT COUNT(*) as todayOrders 
             FROM orders 
             WHERE DATE(created_at) = ?`,
            [today]
        );

        // Revenue Graph Data (Last 7 Days)
        const [revenueResult] = await pool.query(`
            SELECT DATE(timestamp) as date, SUM(amount) as revenue
            FROM payments
            WHERE status = 'Success' AND timestamp >= DATE(NOW()) - INTERVAL 7 DAY
            GROUP BY DATE(timestamp)
            ORDER BY DATE(timestamp) ASC
        `);

        // Popular Items
        const [popularItemsResult] = await pool.query(`
            SELECT m.english_name as name, SUM(oi.quantity) as total_sold
            FROM order_items oi
            JOIN menu_items m ON oi.menu_item_id = m.id
            JOIN orders o ON oi.order_id = o.id
            WHERE o.status = 'Completed'
            GROUP BY m.id
            ORDER BY total_sold DESC
            LIMIT 5
        `);

        res.json({
            todaySales: salesResult[0].todaySales,
            todayOrders: ordersResult[0].todayOrders,
            revenueData: revenueResult,
            popularItems: popularItemsResult
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
