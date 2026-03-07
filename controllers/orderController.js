const pool = require('../database/db');
const { sendPreOrderEmail } = require('../utils/emailService');

// @route   POST api/orders/preorder
// @desc    Create a new pre-order (Website)
// @access  Public
exports.createPreOrder = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const { customer_name, customer_mobile, visit_time, items, total_amount } = req.body;

        // 1. Create Order
        const [orderResult] = await connection.query(
            'INSERT INTO orders (order_type, total_amount, final_amount, customer_name, customer_mobile, visit_time) VALUES (?, ?, ?, ?, ?, ?)',
            ['Pre-Order', total_amount, total_amount, customer_name, customer_mobile, visit_time]
        );
        const orderId = orderResult.insertId;

        // 2. Insert Order Items
        for (let item of items) {
            await connection.query(
                'INSERT INTO order_items (order_id, menu_item_id, quantity, price_at_time) VALUES (?, ?, ?, ?)',
                [orderId, item.id, item.quantity, item.price]
            );
        }

        await connection.commit();

        // 3. Send Email Notification
        const emailSent = await sendPreOrderEmail({
            customer_name,
            customer_mobile,
            visit_time,
            items,
            total_amount
        });

        if (emailSent) {
            console.log(`✅ Pre-order email sent for order #${orderId}`);
        } else {
            console.error(`❌ Failed to send pre-order email for order #${orderId}`);
        }

        res.json({ message: 'Pre-order placed successfully', orderId });
    } catch (err) {
        await connection.rollback();
        console.error(err.message);
        res.status(500).send('Server Error');
    } finally {
        connection.release();
    }
};

// @route   POST api/orders/dine-in
// @desc    Create a new dine-in order (Waiter)
// @access  Private (Waiter)
exports.createDineInOrder = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const { table_id, items, total_amount } = req.body;
        const waiter_id = req.user.id;

        // 1. Create Order
        const [orderResult] = await connection.query(
            'INSERT INTO orders (order_type, table_id, total_amount, final_amount, waiter_id, status) VALUES (?, ?, ?, ?, ?, ?)',
            ['Dine-in', table_id, total_amount, total_amount, waiter_id, 'Preparing']
        );
        const orderId = orderResult.insertId;

        // 2. Insert Order Items
        for (let item of items) {
            await connection.query(
                'INSERT INTO order_items (order_id, menu_item_id, quantity, price_at_time) VALUES (?, ?, ?, ?)',
                [orderId, item.id, item.quantity, item.price]
            );
        }

        // 3. Update Table Status to Occupied
        await connection.query('UPDATE tables SET status = ? WHERE id = ?', ['Occupied', table_id]);

        await connection.commit();
        res.json({ message: 'Order placed successfully', orderId });
    } catch (err) {
        await connection.rollback();
        console.error(err.message);
        res.status(500).send('Server Error');
    } finally {
        connection.release();
    }
};

// @route   GET api/orders/pending
// @desc    Get all pending un-billed orders
// @access  Private (Cashier, Manager)
exports.getPendingOrders = async (req, res) => {
    try {
        const [orders] = await pool.query(
            `SELECT o.*, t.table_number, u.username as waiter_name 
             FROM orders o 
             LEFT JOIN tables t ON o.table_id = t.id 
             LEFT JOIN users u ON o.waiter_id = u.id 
             WHERE o.status IN ('Pending', 'Preparing')
             ORDER BY o.created_at DESC`
        );
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET api/orders/:id
// @desc    Get order details by ID
// @access  Private (Cashier, Manager, Waiter)
exports.getOrderById = async (req, res) => {
    try {
        const [orders] = await pool.query(
            `SELECT o.*, t.table_number, u.username as waiter_name 
             FROM orders o 
             LEFT JOIN tables t ON o.table_id = t.id 
             LEFT JOIN users u ON o.waiter_id = u.id 
             WHERE o.id = ?`,
            [req.params.id]
        );

        if (orders.length === 0) return res.status(404).json({ message: 'Order not found' });

        const [items] = await pool.query(
            `SELECT oi.*, m.english_name, m.hindi_name, m.kannada_name 
             FROM order_items oi 
             JOIN menu_items m ON oi.menu_item_id = m.id 
             WHERE oi.order_id = ?`,
            [req.params.id]
        );

        res.json({ ...orders[0], items });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
