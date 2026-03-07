const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billingController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

router.post('/:orderId', authMiddleware, roleMiddleware(['cashier', 'manager']), billingController.processPayment);
router.get('/invoice/:orderId', authMiddleware, roleMiddleware(['cashier', 'manager']), billingController.generateInvoice);

module.exports = router;
