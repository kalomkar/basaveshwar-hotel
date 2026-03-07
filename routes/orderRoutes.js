const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

router.post('/preorder', orderController.createPreOrder);
router.post('/dine-in', authMiddleware, roleMiddleware(['waiter']), orderController.createDineInOrder);

router.get('/pending', authMiddleware, roleMiddleware(['cashier', 'manager']), orderController.getPendingOrders);
router.get('/:id', authMiddleware, orderController.getOrderById);

module.exports = router;
